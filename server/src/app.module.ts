import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { PrismaClient } from '@prisma/client';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';
import { WebRtcService } from './services/web-rtc.service';
import { RoomManager } from './manager/room.manager';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserResolver } from './resolvers/user/user.resolver';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { directiveTransformer } from './graphql/directive-transformer';

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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      transformSchema: directiveTransformer,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'auth',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
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
  ],
})
export class AppModule {}
