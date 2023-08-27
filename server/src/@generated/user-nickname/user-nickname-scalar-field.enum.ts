import { registerEnumType } from '@nestjs/graphql';

export enum UserNicknameScalarFieldEnum {
    id = "id",
    nickname = "nickname",
    no = "no",
    createdTime = "createdTime",
    updatedTime = "updatedTime",
    deletedTime = "deletedTime"
}


registerEnumType(UserNicknameScalarFieldEnum, { name: 'UserNicknameScalarFieldEnum', description: undefined })
