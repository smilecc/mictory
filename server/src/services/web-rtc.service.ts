import { Injectable, OnModuleInit } from '@nestjs/common';
import type { Worker } from 'mediasoup/node/lib/types';
import * as mediasoup from 'mediasoup';

@Injectable()
export class WebRtcService implements OnModuleInit {
  workers: Worker[] = [];

  async onModuleInit() {
    const worker = await mediasoup.createWorker<Record<string, any>>({
      logLevel: 'debug',
    });

    this.workers.push(worker);
    throw new Error('Method not implemented.');
  }
}
