import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserNicknameWhereInput } from './user-nickname-where.input';
import { Type } from 'class-transformer';
import { UserNicknameOrderByWithAggregationInput } from './user-nickname-order-by-with-aggregation.input';
import { UserNicknameScalarFieldEnum } from './user-nickname-scalar-field.enum';
import { UserNicknameScalarWhereWithAggregatesInput } from './user-nickname-scalar-where-with-aggregates.input';
import { Int } from '@nestjs/graphql';
import { UserNicknameCountAggregateInput } from './user-nickname-count-aggregate.input';
import { UserNicknameAvgAggregateInput } from './user-nickname-avg-aggregate.input';
import { UserNicknameSumAggregateInput } from './user-nickname-sum-aggregate.input';
import { UserNicknameMinAggregateInput } from './user-nickname-min-aggregate.input';
import { UserNicknameMaxAggregateInput } from './user-nickname-max-aggregate.input';

@ArgsType()
export class UserNicknameGroupByArgs {

    @Field(() => UserNicknameWhereInput, {nullable:true})
    @Type(() => UserNicknameWhereInput)
    where?: UserNicknameWhereInput;

    @Field(() => [UserNicknameOrderByWithAggregationInput], {nullable:true})
    orderBy?: Array<UserNicknameOrderByWithAggregationInput>;

    @Field(() => [UserNicknameScalarFieldEnum], {nullable:false})
    by!: Array<keyof typeof UserNicknameScalarFieldEnum>;

    @Field(() => UserNicknameScalarWhereWithAggregatesInput, {nullable:true})
    having?: UserNicknameScalarWhereWithAggregatesInput;

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
