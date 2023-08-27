import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { ChannelCreateNestedOneWithoutRoomsInput } from '../channel/channel-create-nested-one-without-rooms.input';

@InputType()
export class RoomCreateInput {

    @Field(() => String, {nullable:true})
    id?: bigint | number;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => Int, {nullable:true})
    maxMember?: number;

    @Field(() => Date, {nullable:true})
    createdTime?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedTime?: Date | string;

    @Field(() => Date, {nullable:true})
    deletedTime?: Date | string;

    @Field(() => ChannelCreateNestedOneWithoutRoomsInput, {nullable:false})
    channel!: ChannelCreateNestedOneWithoutRoomsInput;
}
