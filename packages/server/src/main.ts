import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadOrGenerateAppSecret } from './utils';
import { ValidationPipe } from '@nestjs/common';
import { MictorySocketAdapter } from './events/socket.adapter';
import * as _ from 'lodash';
import { UserInputError } from '@nestjs/apollo';

declare global {
  // eslint-disable-next-line no-var
  var appSecret: string;
}

global.Object.defineProperty(global.BigInt.prototype, 'toJSON', {
  value: function () {
    return parseInt(this);
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
  await app.listen(3000);
}

bootstrap();
