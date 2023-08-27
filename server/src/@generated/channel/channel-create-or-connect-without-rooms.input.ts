import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';
import { Type } from 'class-transformer';
import { ChannelCreateWithoutRoomsInput } from './channel-create-without-rooms.input';

@InputType()
export class ChannelCreateOrConnectWithoutRoomsInput {

    @Field(() => ChannelWhereUniqueInput, {nullable:false})
    @Type(() => ChannelWhereUniqueInput)
    where!: Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>;

    @Field(() => ChannelCreateWithoutRoomsInput, {nullable:false})
    @Type(() => ChannelCreateWithoutRoomsInput)
    create!: ChannelCreateWithoutRoomsInput;
}
