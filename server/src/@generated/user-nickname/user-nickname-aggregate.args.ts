import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserNicknameWhereInput } from './user-nickname-where.input';
import { Type } from 'class-transformer';
import { UserNicknameOrderByWithRelationInput } from './user-nickname-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { UserNicknameWhereUniqueInput } from './user-nickname-where-unique.input';
import { Int } from '@nestjs/graphql';
import { UserNicknameCountAggregateInput } from './user-nickname-count-aggregate.input';
import { UserNicknameAvgAggregateInput } from './user-nickname-avg-aggregate.input';
import { UserNicknameSumAggregateInput } from './user-nickname-sum-aggregate.input';
import { UserNicknameMinAggregateInput } from './user-nickname-min-aggregate.input';
import { UserNicknameMaxAggregateInput } from './user-nickname-max-aggregate.input';

@ArgsType()
export class UserNicknameAggregateArgs {

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

    @Field(() => UserNicknameCountAggregateInput, {nullable:true})
    _count?: UserNicknameCountAggregateInput;

    @Field(() => UserNicknameAvgAggregateInput, {nullable:true})
    _avg?: UserNicknameAvgAggregateInput;

    @Field(() => UserNicknameSumAggregateInput, {nullable:true})
    _sum?: UserNicknameSumAggregateInput;

    @Field(() => UserNicknameMinAggregateInput, {nullable:true})
    _min?: UserNicknameMinAggregateInput;

    @Field(() => UserNicknameMaxAggregateInput, {nullable:true})
    _max?: UserNicknameMaxAggregateInput;
}
