import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserUncheckedCreateNestedManyWithoutChannelsInput } from '../user/user-unchecked-create-nested-many-without-channels.input';

@InputType()
export class ChannelUncheckedCreateWithoutRoomsInput {

    @Field(() => String, {nullable:true})
    id?: bigint | number;

    @Field(() => String, {nullable:true})
    code?: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:false})
    ownerUserId!: bigint | number;

    @Field(() => Date, {nullable:true})
    createdTime?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedTime?: Date | string;

    @Field(() => Date, {nullable:true})
    deletedTime?: Date | string;

    @Field(() => UserUncheckedCreateNestedManyWithoutChannelsInput, {nullable:true})
    users?: UserUncheckedCreateNestedManyWithoutChannelsInput;
}
