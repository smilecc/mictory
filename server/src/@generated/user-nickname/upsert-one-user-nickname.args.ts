import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UserNicknameWhereUniqueInput } from './user-nickname-where-unique.input';
import { Type } from 'class-transformer';
import { UserNicknameCreateInput } from './user-nickname-create.input';
import { UserNicknameUpdateInput } from './user-nickname-update.input';

@ArgsType()
export class UpsertOneUserNicknameArgs {

    @Field(() => UserNicknameWhereUniqueInput, {nullable:false})
    @Type(() => UserNicknameWhereUniqueInput)
    where!: Prisma.AtLeast<UserNicknameWhereUniqueInput, 'id' | 'nickname'>;

    @Field(() => UserNicknameCreateInput, {nullable:false})
    @Type(() => UserNicknameCreateInput)
    create!: UserNicknameCreateInput;

    @Field(() => UserNicknameUpdateInput, {nullable:false})
    @Type(() => UserNicknameUpdateInput)
    update!: UserNicknameUpdateInput;
}
