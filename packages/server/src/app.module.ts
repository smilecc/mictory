import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { WebRtcService, UserService } from './services';
import { RoomManager } from './manager/room.manager';
import { UserResolver } from './resolvers/user/user.resolver';
import { UserSessionResolver } from './resolvers/user/user-session.resolver';
import { ConfigModule } from '@nestjs/config';
import { ChannelResolver } from './resolvers/channel/channel.resolver';
import { RoomResolver } from './resolvers/room/room.resolver';
import { ChatResolver } from './resolvers/chat/chat.resolver';
import { TxManager } from './manager/tx.manager';
import { ClsModule } from 'nestjs-cls';
import { randomUUID } from 'crypto';
import { AuthModule } from './modules/auth.module';
import { PrismaModule } from './modules/prisma.module';
import { LoggerModule } from './modules/logger.module';
import { GraphQlModule } from './modules/graph-ql.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { appEnv } from './utils';
import { ChatManager } from './manager/chat.manager';
import { UserFriendResolver } from './resolvers/user/user-friend.resolver';
import { SocketIoManager } from './manager/socket-io.manager';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    LoggerModule,
    GraphQlModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
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
    ...(appEnv() === 'dev'
      ? [
          ServeStaticModule.forRoot({
            serveRoot: '/files',
            rootPath: join(__dirname, '..', 'files'),
          }),
        ]
      : []),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EventsGateway,
    WebRtcService,
    RoomManager,
    UserResolver,
    UserService,
    UserSessionResolver,
    ChannelResolver,
    RoomResolver,
    ChatResolver,
    TxManager,
    ChatManager,
    UserFriendResolver,
    SocketIoManager,
  ],
})
export class AppModule {}
