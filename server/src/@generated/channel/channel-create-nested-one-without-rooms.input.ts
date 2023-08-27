import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelCreateWithoutRoomsInput } from './channel-create-without-rooms.input';
import { Type } from 'class-transformer';
import { ChannelCreateOrConnectWithoutRoomsInput } from './channel-create-or-connect-without-rooms.input';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';

@InputType()
export class ChannelCreateNestedOneWithoutRoomsInput {

    @Field(() => ChannelCreateWithoutRoomsInput, {nullable:true})
    @Type(() => ChannelCreateWithoutRoomsInput)
    create?: ChannelCreateWithoutRoomsInput;

    @Field(() => ChannelCreateOrConnectWithoutRoomsInput, {nullable:true})
    @Type(() => ChannelCreateOrConnectWithoutRoomsInput)
    connectOrCreate?: ChannelCreateOrConnectWithoutRoomsInput;

    @Field(() => ChannelWhereUniqueInput, {nullable:true})
    @Type(() => ChannelWhereUniqueInput)
    connect?: Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>;
}
