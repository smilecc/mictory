import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env, getLogger, loadOrGenerateAppSecret } from './utils';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MictorySocketAdapter } from './events/socket.adapter';
import * as _ from 'lodash';
import { UserInputError } from '@nestjs/apollo';

declare global {
  // eslint-disable-next-line no-var
  var appSecret: string;
}

global.Object.defineProperty(global.BigInt.prototype, 'toJSON', {
  value: function () {
    return String(this);
  },
  configurable: true,
  enumerable: false,
  writable: true,
});

async function bootstrap() {
  const logger = getLogger();
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory(errors) {
        const flatErrors = _.flatMapDeep(errors, (error) => error.children);
        const firstError = _.first(flatErrors);
        const firstConstraint = _.findKey(firstError.constraints, () => true);

        return new UserInputError(firstError.constraints[firstConstraint], {
          extensions: {
            field: firstError.property,
          },
        });
      },
    }),
  );

  app.useWebSocketAdapter(new MictorySocketAdapter(app));
  const APP_PORT = env('APP_PORT', '3000');

  logger.log(`App started, listen port: ${APP_PORT}`, 'bootstrap');
  await app.listen(APP_PORT);
}

loadOrGenerateAppSecret();
bootstrap();
