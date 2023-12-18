import { TableId } from 'src/types';
import { UserInputError } from '@nestjs/apollo';
import { GraphQLErrorOptions } from 'graphql';
import { MictoryErrorCodes, MictoryErrorToString } from '@mictory/common';

export function CreateMictoryError(error: MictoryErrorCodes, options?: GraphQLErrorOptions): UserInputError {
  return new UserInputError(MictoryErrorToString(error), options);
}

export const socketUserKey = (userId: TableId) => `USER_${userId}`;
export const socketRoomKey = (roomId: TableId) => `ROOM_${roomId}`;
export const socketChannelKey = (channelId: TableId) => `CHANNEL_${channelId}`;

export * from './env';
