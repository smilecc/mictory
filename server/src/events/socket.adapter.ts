import { Server as SocketServer, Socket } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtUserClaims, RoomId } from 'src/types';
import { instrument } from '@socket.io/admin-ui';

export interface MictorySocket extends Socket {
  user: JwtUserClaims;
  mediasoupRoomId?: RoomId;
}

export class MictorySocketAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server: SocketServer = super.createIOServer(port, options);
    server.use((socket: MictorySocket, next) => {
      const jwtService = this.app.get(JwtService);
      const token = socket.handshake.auth.token;
      try {
        if (token) {
          socket.user = jwtService.verify<JwtUserClaims>(token);
          Logger.debug(socket.user, 'MictorySocketAdapter');
          next();
        } else {
          next(new Error('Auth Error'));
        }
      } catch (e) {
        Logger.warn(e, 'MictorySocketAdapter');
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
