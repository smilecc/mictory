import { Server as SocketServer, Socket } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoomId } from 'src/types';
import { instrument } from '@socket.io/admin-ui';
import { appEnv } from 'src/utils';
import { JwtUserClaims, RequestUserType } from 'src/modules/auth.module';

export interface MictorySocket extends Socket {
  user: JwtUserClaims;
  mediasoupRoomId?: RoomId;
  mediasoupChannelId?: RoomId;
  mediasoupActiveChannelId?: RoomId;
  mediasoupActiveChatRoomId?: RoomId;
}

export class MictorySocketAdapter extends IoAdapter {
  private readonly logger = new Logger(MictorySocketAdapter.name);

  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server: SocketServer = super.createIOServer(port, options);
    server.use((socket: MictorySocket, next) => {
      const jwtService = this.app.get(JwtService);
      const token = socket.handshake.auth.token;
      try {
        if (appEnv() === 'dev' && socket.handshake.auth.debugUser) {
          socket.user = {
            userId: BigInt(socket.handshake.auth.debugUser),
            type: RequestUserType.USER,
          };

          return next();
        }

        if (token) {
          socket.user = jwtService.verify<JwtUserClaims>(token);
          this.logger.debug(JSON.stringify(socket.user));
          next();
        } else {
          next(new Error('Auth Error'));
        }
      } catch (e) {
        this.logger.warn(e, 'MictorySocketAdapter');
        next(e);
      }
    });

    instrument(server, {
      auth: false,
      mode: 'development',
    });
    return server;
  }
}
