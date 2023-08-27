import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserUpdateWithoutOwnedChannelsInput } from './user-update-without-owned-channels.input';
import { Type } from 'class-transformer';
import { UserCreateWithoutOwnedChannelsInput } from './user-create-without-owned-channels.input';
import { UserWhereInput } from './user-where.input';

@InputType()
export class UserUpsertWithoutOwnedChannelsInput {

    @Field(() => UserUpdateWithoutOwnedChannelsInput, {nullable:false})
    @Type(() => UserUpdateWithoutOwnedChannelsInput)
    update!: UserUpdateWithoutOwnedChannelsInput;

    @Field(() => UserCreateWithoutOwnedChannelsInput, {nullable:false})
    @Type(() => UserCreateWithoutOwnedChannelsInput)
    create!: UserCreateWithoutOwnedChannelsInput;

    @Field(() => UserWhereInput, {nullable:true})
    @Type(() => UserWhereInput)
    where?: UserWhereInput;
}
