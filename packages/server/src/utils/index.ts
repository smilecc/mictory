import { RoomId } from 'src/types';
import { UserInputError } from '@nestjs/apollo';
import { GraphQLErrorOptions } from 'graphql';
import { MictoryErrorCodes, MictoryErrorToString } from '@mictory/common';

export function CreateMictoryError(error: MictoryErrorCodes, options?: GraphQLErrorOptions): UserInputError {
  return new UserInputError(MictoryErrorToString(error), options);
}

export const socketRoomKey = (roomId: RoomId) => `ROOM_${roomId}`;
export const socketChannelKey = (channelId: RoomId) => `CHANNEL_${channelId}`;

export * from './env';
