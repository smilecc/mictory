import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { RoomWhereUniqueInput } from './room-where-unique.input';
import { Type } from 'class-transformer';
import { RoomUpdateWithoutChannelInput } from './room-update-without-channel.input';

@InputType()
export class RoomUpdateWithWhereUniqueWithoutChannelInput {

    @Field(() => RoomWhereUniqueInput, {nullable:false})
    @Type(() => RoomWhereUniqueInput)
    where!: Prisma.AtLeast<RoomWhereUniqueInput, 'id'>;

    @Field(() => RoomUpdateWithoutChannelInput, {nullable:false})
    @Type(() => RoomUpdateWithoutChannelInput)
    data!: RoomUpdateWithoutChannelInput;
}
