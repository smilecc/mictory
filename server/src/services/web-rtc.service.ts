import { Injectable, OnModuleInit } from '@nestjs/common';
import type { Worker, Router, WebRtcServer } from 'mediasoup/node/lib/types';
import * as mediasoup from 'mediasoup';

@Injectable()
export class WebRtcService implements OnModuleInit {
  workers: Worker[] = [];
  router: Router;
  rtcServer: WebRtcServer;

  async onModuleInit() {
    const worker = await mediasoup.createWorker<Record<string, any>>({
      logLevel: 'debug',
    });

    this.workers.push(worker);

    this.rtcServer = await worker.createWebRtcServer({
      listenInfos: [
        {
          protocol: 'tcp',
          port: 55555,
          ip: '127.0.0.1',
          // announcedIp: '192.168.1.118',
        },
      ],
    });

    this.router = await worker.createRouter({
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
        },
      ],
    });
  }
}
