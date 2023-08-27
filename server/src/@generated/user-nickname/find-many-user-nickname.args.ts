import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserNicknameWhereInput } from './user-nickname-where.input';
import { Type } from 'class-transformer';
import { UserNicknameOrderByWithRelationInput } from './user-nickname-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { UserNicknameWhereUniqueInput } from './user-nickname-where-unique.input';
import { Int } from '@nestjs/graphql';
import { UserNicknameScalarFieldEnum } from './user-nickname-scalar-field.enum';

@ArgsType()
export class FindManyUserNicknameArgs {

    @Field(() => UserNicknameWhereInput, {nullable:true})
    @Type(() => UserNicknameWhereInput)
    where?: UserNicknameWhereInput;

    @Field(() => [UserNicknameOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<UserNicknameOrderByWithRelationInput>;

    @Field(() => UserNicknameWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<UserNicknameWhereUniqueInput, 'id' | 'nickname'>;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => [UserNicknameScalarFieldEnum], {nullable:true})
    distinct?: Array<keyof typeof UserNicknameScalarFieldEnum>;
}
