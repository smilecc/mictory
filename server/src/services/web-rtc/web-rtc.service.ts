import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { RoomManager } from 'src/manager';
import { RoomId, WorkerAppData, MediasoupWorker, WorkerId, RoomSession } from 'src/types';
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

  async createTransport(worker: MediasoupWorker) {
    return await worker.appData.router.createWebRtcTransport({
      enableTcp: true,
      enableUdp: true,
      preferUdp: true,
      webRtcServer: worker.appData.webRtcServer,
    });
  }
}
