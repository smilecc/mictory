import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserCreateWithoutOwnedChannelsInput } from './user-create-without-owned-channels.input';
import { Type } from 'class-transformer';
import { UserCreateOrConnectWithoutOwnedChannelsInput } from './user-create-or-connect-without-owned-channels.input';
import { Prisma } from '@prisma/client';
import { UserWhereUniqueInput } from './user-where-unique.input';

@InputType()
export class UserCreateNestedOneWithoutOwnedChannelsInput {

    @Field(() => UserCreateWithoutOwnedChannelsInput, {nullable:true})
    @Type(() => UserCreateWithoutOwnedChannelsInput)
    create?: UserCreateWithoutOwnedChannelsInput;

    @Field(() => UserCreateOrConnectWithoutOwnedChannelsInput, {nullable:true})
    @Type(() => UserCreateOrConnectWithoutOwnedChannelsInput)
    connectOrCreate?: UserCreateOrConnectWithoutOwnedChannelsInput;

    @Field(() => UserWhereUniqueInput, {nullable:true})
    @Type(() => UserWhereUniqueInput)
    connect?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'username'>;
}
