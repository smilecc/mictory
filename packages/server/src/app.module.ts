import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { PrismaClient } from '@prisma/client';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';
import { WebRtcService, UserService } from './services';
import { RoomManager } from './manager/room.manager';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserResolver } from './resolvers/user/user.resolver';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { directiveTransformer } from './graphql/directive-transformer';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { env, loadOrGenerateAppSecret } from './utils';
import { Request } from 'express';
import { UserSessionResolver } from './resolvers/user/user-session.resolver';
import { ConfigModule } from '@nestjs/config';
import { ChannelResolver } from './resolvers/channel/channel.resolver';
import { RoomResolver } from './resolvers/room/room.resolver';
import { ChatResolver } from './resolvers/chat/chat.resolver';
import { TxManager } from './manager/tx.manager';
import { ClsModule } from 'nestjs-cls';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
prisma.$use(
  createSoftDeleteMiddleware({
    models: {
      User: true,
    },
    defaultConfig: {
      field: 'deletedTime',
      createValue: (deleted) => {
        if (deleted) return new Date();
        return null;
      },
    },
  }),
);

const JwtDynamicModule = JwtModule.register({
  global: true,
  secret: loadOrGenerateAppSecret(),
  signOptions: { expiresIn: '365d' },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtDynamicModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [JwtDynamicModule],
      inject: [JwtService],
      useFactory: (jwtService: JwtService) => ({
        autoSchemaFile: true,
        installSubscriptionHandlers: true,
        transformSchema: directiveTransformer,
        context: async (ctx: { req?: Request }) => {
          try {
            if (env('APP_ENV', 'prod') === 'dev' && ctx.req && ctx.req?.headers?.debuguser) {
              return {
                ...ctx,
                user: {
                  userId: parseInt(ctx.req.headers.debuguser as string),
                },
              };
            }

            if (ctx.req && ctx.req?.headers?.authorization) {
              const jwtJson = await jwtService.verifyAsync(ctx.req.headers.authorization);
              return { ...ctx, user: jwtJson };
            }
            return ctx;
          } catch {
            return ctx;
          }
        },
        buildSchemaOptions: {
          directives: [
            new GraphQLDirective({
              name: 'auth',
              locations: [DirectiveLocation.FIELD_DEFINITION],
            }),
          ],
        },
      }),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator() {
          return randomUUID().replaceAll('-', '');
        },
        // setup(_cls, _req: Request) {},
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EventsGateway,
    {
      provide: PrismaClient,
      useValue: prisma,
    },
    WebRtcService,
    RoomManager,
    UserResolver,
    UserService,
    UserSessionResolver,
    ChannelResolver,
    RoomResolver,
    ChatResolver,
    TxManager,
  ],
})
export class AppModule {}
