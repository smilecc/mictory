import { UserInputError } from '@nestjs/apollo';
import { GraphQLErrorOptions } from 'graphql';

export enum MictoryErrorCodes {
  USER_EXISTED,
  PASSWORD_WRONG,
}

export function CreateMictoryError(error: MictoryErrorCodes, options?: GraphQLErrorOptions): UserInputError {
  return new UserInputError(MictoryErrorCodes[error], options);
}
