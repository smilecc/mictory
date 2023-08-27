import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UserNicknameWhereUniqueInput } from './user-nickname-where-unique.input';
import { Type } from 'class-transformer';

@ArgsType()
export class FindUniqueUserNicknameArgs {

    @Field(() => UserNicknameWhereUniqueInput, {nullable:false})
    @Type(() => UserNicknameWhereUniqueInput)
    where!: Prisma.AtLeast<UserNicknameWhereUniqueInput, 'id' | 'nickname'>;
}
