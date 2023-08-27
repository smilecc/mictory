import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { UserCountOrderByAggregateInput } from './user-count-order-by-aggregate.input';
import { UserAvgOrderByAggregateInput } from './user-avg-order-by-aggregate.input';
import { UserMaxOrderByAggregateInput } from './user-max-order-by-aggregate.input';
import { UserMinOrderByAggregateInput } from './user-min-order-by-aggregate.input';
import { UserSumOrderByAggregateInput } from './user-sum-order-by-aggregate.input';

@InputType()
export class UserOrderByWithAggregationInput {

    @Field(() => SortOrder, {nullable:true})
    id?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    username?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    nickname?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    nicknameNo?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    sessionState?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    password?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    passwordSalt?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    createdTime?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    updatedTime?: keyof typeof SortOrder;

    @Field(() => SortOrderInput, {nullable:true})
    deletedTime?: SortOrderInput;

    @Field(() => UserCountOrderByAggregateInput, {nullable:true})
    _count?: UserCountOrderByAggregateInput;

    @Field(() => UserAvgOrderByAggregateInput, {nullable:true})
    _avg?: UserAvgOrderByAggregateInput;

    @Field(() => UserMaxOrderByAggregateInput, {nullable:true})
    _max?: UserMaxOrderByAggregateInput;

    @Field(() => UserMinOrderByAggregateInput, {nullable:true})
    _min?: UserMinOrderByAggregateInput;

    @Field(() => UserSumOrderByAggregateInput, {nullable:true})
    _sum?: UserSumOrderByAggregateInput;
}
