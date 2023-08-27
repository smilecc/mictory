import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { Type } from 'class-transformer';
import { UserUpdateWithoutChannelsInput } from './user-update-without-channels.input';
import { UserCreateWithoutChannelsInput } from './user-create-without-channels.input';

@InputType()
export class UserUpsertWithWhereUniqueWithoutChannelsInput {

    @Field(() => UserWhereUniqueInput, {nullable:false})
    @Type(() => UserWhereUniqueInput)
    where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'username'>;

    @Field(() => UserUpdateWithoutChannelsInput, {nullable:false})
    @Type(() => UserUpdateWithoutChannelsInput)
    update!: UserUpdateWithoutChannelsInput;

    @Field(() => UserCreateWithoutChannelsInput, {nullable:false})
    @Type(() => UserCreateWithoutChannelsInput)
    create!: UserCreateWithoutChannelsInput;
}
