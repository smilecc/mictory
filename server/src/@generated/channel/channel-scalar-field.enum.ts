import { registerEnumType } from '@nestjs/graphql';

export enum ChannelScalarFieldEnum {
    id = "id",
    code = "code",
    name = "name",
    ownerUserId = "ownerUserId",
    createdTime = "createdTime",
    updatedTime = "updatedTime",
    deletedTime = "deletedTime"
}


registerEnumType(ChannelScalarFieldEnum, { name: 'ChannelScalarFieldEnum', description: undefined })
