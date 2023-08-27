import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { RoomCreateWithoutChannelInput } from './room-create-without-channel.input';
import { Type } from 'class-transformer';
import { RoomCreateOrConnectWithoutChannelInput } from './room-create-or-connect-without-channel.input';
import { RoomCreateManyChannelInputEnvelope } from './room-create-many-channel-input-envelope.input';
import { Prisma } from '@prisma/client';
import { RoomWhereUniqueInput } from './room-where-unique.input';

@InputType()
export class RoomUncheckedCreateNestedManyWithoutChannelInput {

    @Field(() => [RoomCreateWithoutChannelInput], {nullable:true})
    @Type(() => RoomCreateWithoutChannelInput)
    create?: Array<RoomCreateWithoutChannelInput>;

    @Field(() => [RoomCreateOrConnectWithoutChannelInput], {nullable:true})
    @Type(() => RoomCreateOrConnectWithoutChannelInput)
    connectOrCreate?: Array<RoomCreateOrConnectWithoutChannelInput>;

    @Field(() => RoomCreateManyChannelInputEnvelope, {nullable:true})
    @Type(() => RoomCreateManyChannelInputEnvelope)
    createMany?: RoomCreateManyChannelInputEnvelope;

    @Field(() => [RoomWhereUniqueInput], {nullable:true})
    @Type(() => RoomWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<RoomWhereUniqueInput, 'id'>>;
}
