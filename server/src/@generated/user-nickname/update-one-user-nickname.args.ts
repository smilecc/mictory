import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserNicknameUpdateInput } from './user-nickname-update.input';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { UserNicknameWhereUniqueInput } from './user-nickname-where-unique.input';

@ArgsType()
export class UpdateOneUserNicknameArgs {

    @Field(() => UserNicknameUpdateInput, {nullable:false})
    @Type(() => UserNicknameUpdateInput)
    data!: UserNicknameUpdateInput;

    @Field(() => UserNicknameWhereUniqueInput, {nullable:false})
    @Type(() => UserNicknameWhereUniqueInput)
    where!: Prisma.AtLeast<UserNicknameWhereUniqueInput, 'id' | 'nickname'>;
}
