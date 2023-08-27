import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { Type } from 'class-transformer';
import { UserCreateWithoutOwnedChannelsInput } from './user-create-without-owned-channels.input';

@InputType()
export class UserCreateOrConnectWithoutOwnedChannelsInput {

    @Field(() => UserWhereUniqueInput, {nullable:false})
    @Type(() => UserWhereUniqueInput)
    where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'username'>;

    @Field(() => UserCreateWithoutOwnedChannelsInput, {nullable:false})
    @Type(() => UserCreateWithoutOwnedChannelsInput)
    create!: UserCreateWithoutOwnedChannelsInput;
}
