import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import { appEnv } from './env';
import { LoggerService } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import dayjs = require('dayjs');
import { CLS_REQUEST_USER } from '../consts';

let logger: LoggerService = null;

const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const requestUserFormat = () => {
  return winston.format((info) => {
    const cls = ClsServiceManager.getClsService();
    if (cls.isActive()) {
      const requestUserId = cls.get(CLS_REQUEST_USER);
      if (requestUserId) {
        info.uid = requestUserId;
      }

      if (cls.getId()) {
        info.rid = cls.getId();
      }
    }

    return info;
  });
};

export function getLogger(appName: string = 'App') {
  if (logger) return logger;
  logger = WinstonModule.createLogger({
    level: appEnv() === 'dev' ? 'debug' : 'info',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          requestUserFormat()(),
          winston.format.timestamp({ format: () => dayjs().format(TIMESTAMP_FORMAT) }),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(appName, {
            colors: appEnv() === 'dev',
            prettyPrint: appEnv() === 'dev',
          }),
        ),
      }),
      ...(appEnv() === 'dev'
        ? []
        : [
            new winston.transports.File({
              format: winston.format.combine(
                requestUserFormat()(),
                winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
                winston.format.json({ bigint: true }),
              ),
              filename: './logs/error.log',
              level: 'error',
              maxsize: 1000 * 2000,
              maxFiles: 20,
            }),
            new winston.transports.File({
              format: winston.format.combine(
                requestUserFormat()(),
                winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
                winston.format.json({ bigint: true }),
              ),
              filename: './logs/info.log',
              maxsize: 1000 * 2000,
              maxFiles: 5,
            }),
          ]),
    ],
  });

  return logger;
}
