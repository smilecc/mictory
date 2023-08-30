import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadOrGenerateAppSecret } from './utils';
import { ValidationPipe } from '@nestjs/common';
import { MictorySocketAdapter } from './events/socket.adapter';

declare global {
  // eslint-disable-next-line no-var
  var appSecret: string;
}

global.Object.defineProperty(global.BigInt.prototype, 'toJSON', {
  value: function () {
    return this.toString();
  },
  configurable: true,
  enumerable: false,
  writable: true,
});

async function bootstrap() {
  // const worker = await mediasoup.createWorker<Record<string, any>>({
  //   logLevel: 'debug',
  // });

  // worker.on('died', () => {
  //   setTimeout(() => process.exit(1), 2000);
  // });

  // worker.appData.rtc = await worker.createWebRtcServer({
  //   listenInfos: [
  //     {
  //       protocol: 'tcp',
  //       port: 44444,
  //       ip: '0.0.0.0',
  //       announcedIp: '192.168.1.118',
  //     },
  //   ],
  // });

  // const router = await worker.createRouter({
  //   mediaCodecs: [
  //     {
  //       kind: 'audio',
  //       mimeType: 'audio/opus',
  //       clockRate: 48000,
  //       channels: 2,
  //     },
  //   ],
  // });

  // router.createActiveSpeakerObserver();

  // router.createWebRtcTransport()

  // setInterval(async () => {
  //   const usage = await worker.getResourceUsage();

  //   console.info(
  //     'mediasoup Worker resource usage [pid:%d]: %o',
  //     worker.pid,
  //     usage,
  //   );
  // }, 2000);

  loadOrGenerateAppSecret();

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new MictorySocketAdapter(app));
  await app.listen(3000);
}

bootstrap();
