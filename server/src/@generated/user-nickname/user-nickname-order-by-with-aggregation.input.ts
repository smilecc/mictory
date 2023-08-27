import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { UserNicknameCountOrderByAggregateInput } from './user-nickname-count-order-by-aggregate.input';
import { UserNicknameAvgOrderByAggregateInput } from './user-nickname-avg-order-by-aggregate.input';
import { UserNicknameMaxOrderByAggregateInput } from './user-nickname-max-order-by-aggregate.input';
import { UserNicknameMinOrderByAggregateInput } from './user-nickname-min-order-by-aggregate.input';
import { UserNicknameSumOrderByAggregateInput } from './user-nickname-sum-order-by-aggregate.input';

@InputType()
export class UserNicknameOrderByWithAggregationInput {

    @Field(() => SortOrder, {nullable:true})
    id?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    nickname?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    no?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    createdTime?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    updatedTime?: keyof typeof SortOrder;

    @Field(() => SortOrderInput, {nullable:true})
    deletedTime?: SortOrderInput;

    @Field(() => UserNicknameCountOrderByAggregateInput, {nullable:true})
    _count?: UserNicknameCountOrderByAggregateInput;

    @Field(() => UserNicknameAvgOrderByAggregateInput, {nullable:true})
    _avg?: UserNicknameAvgOrderByAggregateInput;

    @Field(() => UserNicknameMaxOrderByAggregateInput, {nullable:true})
    _max?: UserNicknameMaxOrderByAggregateInput;

    @Field(() => UserNicknameMinOrderByAggregateInput, {nullable:true})
    _min?: UserNicknameMinOrderByAggregateInput;

    @Field(() => UserNicknameSumOrderByAggregateInput, {nullable:true})
    _sum?: UserNicknameSumOrderByAggregateInput;
}
