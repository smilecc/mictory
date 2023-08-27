import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserUncheckedCreateNestedManyWithoutChannelsInput } from '../user/user-unchecked-create-nested-many-without-channels.input';
import { RoomUncheckedCreateNestedManyWithoutChannelInput } from '../room/room-unchecked-create-nested-many-without-channel.input';

@InputType()
export class ChannelUncheckedCreateWithoutOwnerUserInput {

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

    @Field(() => UserUncheckedCreateNestedManyWithoutChannelsInput, {nullable:true})
    users?: UserUncheckedCreateNestedManyWithoutChannelsInput;

    @Field(() => RoomUncheckedCreateNestedManyWithoutChannelInput, {nullable:true})
    rooms?: RoomUncheckedCreateNestedManyWithoutChannelInput;
}
