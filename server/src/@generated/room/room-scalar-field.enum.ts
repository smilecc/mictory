import { registerEnumType } from '@nestjs/graphql';

export enum RoomScalarFieldEnum {
    id = "id",
    channelId = "channelId",
    name = "name",
    maxMember = "maxMember",
    createdTime = "createdTime",
    updatedTime = "updatedTime",
    deletedTime = "deletedTime"
}


registerEnumType(RoomScalarFieldEnum, { name: 'RoomScalarFieldEnum', description: undefined })
