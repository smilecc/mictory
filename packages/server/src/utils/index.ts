import { TableId } from 'src/types';
import { UserInputError } from '@nestjs/apollo';
import { GraphQLErrorOptions } from 'graphql';
import { MictoryErrorCodes, MictoryErrorToString } from '@mictory/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { customAlphabet, nanoid, urlAlphabet } from 'nanoid';
import { env } from './env';
import { getLogger } from './logger';

export function CreateMictoryError(error: MictoryErrorCodes, options?: GraphQLErrorOptions): UserInputError {
  return new UserInputError(MictoryErrorToString(error), options);
}

export const urlNanoid = customAlphabet(urlAlphabet, 21);
export const socketUserKey = (userId: TableId) => `USER_${userId}`;
export const socketRoomKey = (roomId: TableId) => `ROOM_${roomId}`;
export const socketChannelKey = (channelId: TableId) => `CHANNEL_${channelId}`;

export * from './env';
export * from './logger';

/**
 * 加载或生成一个应用秘钥
 */
export function loadOrGenerateAppSecret(): string {
  const secretPath = env('APP_SECRET_PATH', '.secret');
  if (!existsSync(secretPath)) {
    global.appSecret = nanoid(64);
    writeFileSync(secretPath, global.appSecret);
  } else {
    global.appSecret = readFileSync(secretPath).toString();
  }

  getLogger().log(`AppSecret: ${global.appSecret}`, 'utils');

  return global.appSecret;
}
