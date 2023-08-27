import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { RoomWhereUniqueInput } from './room-where-unique.input';
import { Type } from 'class-transformer';
import { RoomUpdateWithoutChannelInput } from './room-update-without-channel.input';
import { RoomCreateWithoutChannelInput } from './room-create-without-channel.input';

@InputType()
export class RoomUpsertWithWhereUniqueWithoutChannelInput {

    @Field(() => RoomWhereUniqueInput, {nullable:false})
    @Type(() => RoomWhereUniqueInput)
    where!: Prisma.AtLeast<RoomWhereUniqueInput, 'id'>;

    @Field(() => RoomUpdateWithoutChannelInput, {nullable:false})
    @Type(() => RoomUpdateWithoutChannelInput)
    update!: RoomUpdateWithoutChannelInput;

    @Field(() => RoomCreateWithoutChannelInput, {nullable:false})
    @Type(() => RoomCreateWithoutChannelInput)
    create!: RoomCreateWithoutChannelInput;
}
