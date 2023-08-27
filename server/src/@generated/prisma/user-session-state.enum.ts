import { registerEnumType } from '@nestjs/graphql';

export enum UserSessionState {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE"
}


registerEnumType(UserSessionState, { name: 'UserSessionState', description: undefined })
