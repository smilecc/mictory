import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { ChannelCountOrderByAggregateInput } from './channel-count-order-by-aggregate.input';
import { ChannelAvgOrderByAggregateInput } from './channel-avg-order-by-aggregate.input';
import { ChannelMaxOrderByAggregateInput } from './channel-max-order-by-aggregate.input';
import { ChannelMinOrderByAggregateInput } from './channel-min-order-by-aggregate.input';
import { ChannelSumOrderByAggregateInput } from './channel-sum-order-by-aggregate.input';

@InputType()
export class ChannelOrderByWithAggregationInput {

    @Field(() => SortOrder, {nullable:true})
    id?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    code?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    name?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    ownerUserId?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    createdTime?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    updatedTime?: keyof typeof SortOrder;

    @Field(() => SortOrderInput, {nullable:true})
    deletedTime?: SortOrderInput;

    @Field(() => ChannelCountOrderByAggregateInput, {nullable:true})
    _count?: ChannelCountOrderByAggregateInput;

    @Field(() => ChannelAvgOrderByAggregateInput, {nullable:true})
    _avg?: ChannelAvgOrderByAggregateInput;

    @Field(() => ChannelMaxOrderByAggregateInput, {nullable:true})
    _max?: ChannelMaxOrderByAggregateInput;

    @Field(() => ChannelMinOrderByAggregateInput, {nullable:true})
    _min?: ChannelMinOrderByAggregateInput;

    @Field(() => ChannelSumOrderByAggregateInput, {nullable:true})
    _sum?: ChannelSumOrderByAggregateInput;
}
