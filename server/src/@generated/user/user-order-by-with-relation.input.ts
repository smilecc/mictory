import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { ChannelOrderByRelationAggregateInput } from '../channel/channel-order-by-relation-aggregate.input';

@InputType()
export class UserOrderByWithRelationInput {

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

    @Field(() => ChannelOrderByRelationAggregateInput, {nullable:true})
    ownedChannels?: ChannelOrderByRelationAggregateInput;

    @Field(() => ChannelOrderByRelationAggregateInput, {nullable:true})
    channels?: ChannelOrderByRelationAggregateInput;
}
