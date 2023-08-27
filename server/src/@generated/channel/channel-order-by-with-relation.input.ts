import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { SortOrderInput } from '../prisma/sort-order.input';
import { UserOrderByWithRelationInput } from '../user/user-order-by-with-relation.input';
import { UserOrderByRelationAggregateInput } from '../user/user-order-by-relation-aggregate.input';
import { RoomOrderByRelationAggregateInput } from '../room/room-order-by-relation-aggregate.input';

@InputType()
export class ChannelOrderByWithRelationInput {

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

    @Field(() => UserOrderByWithRelationInput, {nullable:true})
    ownerUser?: UserOrderByWithRelationInput;

    @Field(() => UserOrderByRelationAggregateInput, {nullable:true})
    users?: UserOrderByRelationAggregateInput;

    @Field(() => RoomOrderByRelationAggregateInput, {nullable:true})
    rooms?: RoomOrderByRelationAggregateInput;
}
