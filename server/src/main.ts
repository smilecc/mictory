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
  loadOrGenerateAppSecret();

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new MictorySocketAdapter(app));
  await app.listen(3000);
}

bootstrap();
