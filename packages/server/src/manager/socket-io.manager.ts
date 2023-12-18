import { Injectable } from '@nestjs/common';
import { Server as SocketServer } from 'socket.io';

@Injectable()
export class SocketIoManager {
  public socket: SocketServer;
}
