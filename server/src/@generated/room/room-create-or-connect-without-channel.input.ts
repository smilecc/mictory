import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { RoomWhereUniqueInput } from './room-where-unique.input';
import { Type } from 'class-transformer';
import { RoomCreateWithoutChannelInput } from './room-create-without-channel.input';

@InputType()
export class RoomCreateOrConnectWithoutChannelInput {

    @Field(() => RoomWhereUniqueInput, {nullable:false})
    @Type(() => RoomWhereUniqueInput)
    where!: Prisma.AtLeast<RoomWhereUniqueInput, 'id'>;

    @Field(() => RoomCreateWithoutChannelInput, {nullable:false})
    @Type(() => RoomCreateWithoutChannelInput)
    create!: RoomCreateWithoutChannelInput;
}
