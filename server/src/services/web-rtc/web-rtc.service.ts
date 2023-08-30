import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { RoomManager } from 'src/manager';
import {
  RoomId,
  WorkerAppData,
  MediasoupWorker,
  WorkerId,
  RoomSession,
  SessionTransportDirection,
  SessionTransport,
} from 'src/types';
import { nanoid } from 'nanoid';

@Injectable()
export class WebRtcService implements OnModuleInit {
  protected workers: MediasoupWorker[] = [];
  protected nextWorkderIndex: number = 0;

  constructor(private readonly roomManager: RoomManager) {}

  async onModuleInit() {
    const worker = await mediasoup.createWorker<WorkerAppData>({
      logLevel: 'debug',
    });

    this.workers.push(worker);

    worker.appData.id = nanoid();
    // 创建WebRtc服务
    worker.appData.webRtcServer = await worker.createWebRtcServer({
      listenInfos: [
        {
          protocol: 'tcp',
          port: 55555,
          ip: '127.0.0.1',
          // announcedIp: '192.168.1.118',
        },
      ],
    });

    // 创建路由
    worker.appData.router = await worker.createRouter({
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000,
          },
        },
      ],
    });
  }

  getWorker(workerId: WorkerId): MediasoupWorker {
    return this.workers.find((it) => it.appData.id === workerId);
  }

  getNextWorker(): MediasoupWorker {
    const worker = this.workers[this.nextWorkderIndex];

    if (++this.nextWorkderIndex === this.workers.length) {
      this.nextWorkderIndex = 0;
    }

    return worker;
  }

  getRoom(roomId: RoomId) {
    return this.roomManager.getOrCreateRoom(roomId, () => this.getNextWorker());
  }

  getWorkerByRoomId(roomId: RoomId): MediasoupWorker {
    const room = this.getRoom(roomId);
    return this.getWorker(room.workerId);
  }

  async joinRoom(roomId: RoomId, userId: bigint): Promise<RoomSession> {
    Logger.log(`Join Room, User: ${userId} Room: ${roomId}`);
    const room = this.getRoom(roomId);
    const worker = this.getWorker(room.workerId);

    const oldSession = room.sessions.find((it) => it.userId == userId);
    if (oldSession) {
      return oldSession;
    }

    // 创建会话
    const session: RoomSession = {
      id: nanoid(),
      roomId,
      userId,
      workerId: worker.appData.id,
      transports: [],
    };

    room.sessions.push(session);
    return session;
  }

  async createTransport(roomId: RoomId, userId: bigint, transportDirection: SessionTransportDirection) {
    Logger.log(`CreateTransport, Room: ${roomId} User: ${userId} Direction: ${transportDirection}`);
    const room = this.getRoom(roomId);
    const worker = this.getWorker(room.workerId);
    const transport = await worker.appData.router.createWebRtcTransport({
      enableTcp: true,
      enableUdp: true,
      preferUdp: true,
      webRtcServer: worker.appData.webRtcServer,
    });

    const session = room.sessions.find((it) => it.userId === userId);
    session.transports.push({
      transport,
      direction: transportDirection,
    });

    Logger.log(
      `CreateTransport Success, TransportId: ${transport.id} Room: ${roomId} User: ${userId} TransportCount: ${session.transports.length}`,
    );
    return transport;
  }

  getTransport(roomId: RoomId, userId: bigint, transportId: string): SessionTransport | undefined {
    const room = this.getRoom(roomId);
    const session = room.sessions.find((it) => it.userId == userId);
    return session?.transports?.find((it) => it.transport.id === transportId);
  }

  async exitRoom(roomId: RoomId, userId: bigint) {
    const room = this.getRoom(roomId);
    const roomSessionIndex = room.sessions.findIndex((it) => it.userId === userId);
    if (roomSessionIndex !== -1) {
      const roomSession = room.sessions[roomSessionIndex];
      roomSession.transports.forEach((it) => it.transport.close());
      room.sessions.splice(roomSessionIndex, 1);
    }

    Logger.log(`Exit Room, User: ${userId} Room: ${roomId}`);
  }
}
