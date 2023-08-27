import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserWhereInput } from './user-where.input';
import { Type } from 'class-transformer';
import { UserUpdateWithoutOwnedChannelsInput } from './user-update-without-owned-channels.input';

@InputType()
export class UserUpdateToOneWithWhereWithoutOwnedChannelsInput {

    @Field(() => UserWhereInput, {nullable:true})
    @Type(() => UserWhereInput)
    where?: UserWhereInput;

    @Field(() => UserUpdateWithoutOwnedChannelsInput, {nullable:false})
    @Type(() => UserUpdateWithoutOwnedChannelsInput)
    data!: UserUpdateWithoutOwnedChannelsInput;
}
