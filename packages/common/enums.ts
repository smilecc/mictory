export enum MictoryErrorCodes {
  USER_EXISTED,
  PASSWORD_WRONG,
  INVAILD_USERNAME,
  INVAILD_USER_NICKNAME,
  INVAILD_USER_PASSWORD,
}

export function MictoryErrorToString(error: MictoryErrorCodes): string {
  return MictoryErrorCodes[error];
}
