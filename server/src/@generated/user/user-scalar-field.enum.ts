import { registerEnumType } from '@nestjs/graphql';

export enum UserScalarFieldEnum {
    id = "id",
    username = "username",
    nickname = "nickname",
    nicknameNo = "nicknameNo",
    sessionState = "sessionState",
    password = "password",
    passwordSalt = "passwordSalt",
    createdTime = "createdTime",
    updatedTime = "updatedTime",
    deletedTime = "deletedTime"
}


registerEnumType(UserScalarFieldEnum, { name: 'UserScalarFieldEnum', description: undefined })
