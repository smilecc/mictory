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
  Room,
} from 'src/types';
import { nanoid } from 'nanoid';
import { Server as SocketServer } from 'socket.io';
import { socketRoomKey } from 'src/utils';

@Injectable()
export class WebRtcService implements OnModuleInit {
  private workers: MediasoupWorker[] = [];
  private nextWorkderIndex: number = 0;
  private rooms: Room[] = [];
  public socketServer: SocketServer;

  private readonly logger = new Logger(WebRtcService.name);

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

  async getRoom(roomId: RoomId): Promise<Room> {
    let room = this.rooms.find((it) => it.roomId === roomId);
    if (!room) {
      const worker = this.getNextWorker();
      room = {
        roomId,
        workerId: worker.appData.id,
        sessions: [],
        activeSpeakerObserver: await worker.appData.router.createActiveSpeakerObserver(),
        audioLevelObserver: await worker.appData.router.createAudioLevelObserver({
          maxEntries: 50,
          threshold: -50,
          interval: 2000,
        }),
      };

      room.audioLevelObserver.on('volumes', (volumes) => {
        volumes.forEach(async ({ producer, volume }) => {
          this.logger.debug(
            `AudioLevelObserver on:volumes, Producer: ${producer.id} Volume: ${volume} [${volumes.length}]`,
          );

          // 通知客户端
          const transport = room.sessions.flatMap((it) => it.transports).find((it) => it.producer.id === producer.id);
          const session = room.sessions.find((it) => it.id === transport.sessionId);
          this.socketServer.to(socketRoomKey(roomId)).emit('speak', {
            producerId: producer.id,
            userId: session.userId,
            sessionId: session.id,
            volume,
          });
        });
      });

      room.audioLevelObserver.on('silence', () => {
        this.logger.debug(`AudioLevelObserver on:silence`);
      });

      this.rooms.push(room);
    }

    return room;
  }

  async getWorkerByRoomId(roomId: RoomId): Promise<MediasoupWorker> {
    const room = await this.getRoom(roomId);
    return this.getWorker(room.workerId);
  }

  async joinRoom(roomId: RoomId, userId: bigint): Promise<RoomSession> {
    this.logger.log(`Join Room, User: ${userId} Room: ${roomId}`);
    const room = await this.getRoom(roomId);
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
    this.logger.log(`CreateTransport, Room: ${roomId} User: ${userId} Direction: ${transportDirection}`);
    const room = await this.getRoom(roomId);
    const worker = this.getWorker(room.workerId);
    const transport = await worker.appData.router.createWebRtcTransport({
      enableTcp: true,
      enableUdp: true,
      preferUdp: true,
      webRtcServer: worker.appData.webRtcServer,
    });

    const session = room.sessions.find((it) => it.userId === userId);
    session.transports.push({
      sessionId: session.id,
      transport,
      direction: transportDirection,
    });

    this.logger.log(
      `CreateTransport Success, TransportId: ${transport.id} Room: ${roomId} User: ${userId} TransportCount: ${session.transports.length}`,
    );
    return transport;
  }

  async getTransport(roomId: RoomId, userId: bigint, transportId: string): Promise<SessionTransport | undefined> {
    const room = await this.getRoom(roomId);
    const session = room.sessions.find((it) => it.userId == userId);
    return session?.transports?.find((it) => it.transport.id === transportId);
  }

  async exitRoom(roomId: RoomId, userId: bigint) {
    const room = await this.getRoom(roomId);
    const roomSessionIndex = room.sessions.findIndex((it) => it.userId === userId);
    if (roomSessionIndex !== -1) {
      const roomSession = room.sessions[roomSessionIndex];
      roomSession.transports.forEach((it) => it.transport.close());
      room.sessions.splice(roomSessionIndex, 1);
    }

    this.logger.log(`Exit Room, User: ${userId} Room: ${roomId}`);
  }
}
