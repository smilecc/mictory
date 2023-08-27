import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserCreateNestedOneWithoutOwnedChannelsInput } from '../user/user-create-nested-one-without-owned-channels.input';
import { RoomCreateNestedManyWithoutChannelInput } from '../room/room-create-nested-many-without-channel.input';

@InputType()
export class ChannelCreateWithoutUsersInput {

    @Field(() => String, {nullable:true})
    id?: bigint | number;

    @Field(() => String, {nullable:true})
    code?: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => Date, {nullable:true})
    createdTime?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedTime?: Date | string;

    @Field(() => Date, {nullable:true})
    deletedTime?: Date | string;

    @Field(() => UserCreateNestedOneWithoutOwnedChannelsInput, {nullable:false})
    ownerUser!: UserCreateNestedOneWithoutOwnedChannelsInput;

    @Field(() => RoomCreateNestedManyWithoutChannelInput, {nullable:true})
    rooms?: RoomCreateNestedManyWithoutChannelInput;
}
