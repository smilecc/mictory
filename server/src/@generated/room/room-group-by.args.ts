import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { RoomWhereInput } from './room-where.input';
import { Type } from 'class-transformer';
import { RoomOrderByWithAggregationInput } from './room-order-by-with-aggregation.input';
import { RoomScalarFieldEnum } from './room-scalar-field.enum';
import { RoomScalarWhereWithAggregatesInput } from './room-scalar-where-with-aggregates.input';
import { Int } from '@nestjs/graphql';
import { RoomCountAggregateInput } from './room-count-aggregate.input';
import { RoomAvgAggregateInput } from './room-avg-aggregate.input';
import { RoomSumAggregateInput } from './room-sum-aggregate.input';
import { RoomMinAggregateInput } from './room-min-aggregate.input';
import { RoomMaxAggregateInput } from './room-max-aggregate.input';

@ArgsType()
export class RoomGroupByArgs {

    @Field(() => RoomWhereInput, {nullable:true})
    @Type(() => RoomWhereInput)
    where?: RoomWhereInput;

    @Field(() => [RoomOrderByWithAggregationInput], {nullable:true})
    orderBy?: Array<RoomOrderByWithAggregationInput>;

    @Field(() => [RoomScalarFieldEnum], {nullable:false})
    by!: Array<keyof typeof RoomScalarFieldEnum>;

    @Field(() => RoomScalarWhereWithAggregatesInput, {nullable:true})
    having?: RoomScalarWhereWithAggregatesInput;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => RoomCountAggregateInput, {nullable:true})
    _count?: RoomCountAggregateInput;

    @Field(() => RoomAvgAggregateInput, {nullable:true})
    _avg?: RoomAvgAggregateInput;

    @Field(() => RoomSumAggregateInput, {nullable:true})
    _sum?: RoomSumAggregateInput;

    @Field(() => RoomMinAggregateInput, {nullable:true})
    _min?: RoomMinAggregateInput;

    @Field(() => RoomMaxAggregateInput, {nullable:true})
    _max?: RoomMaxAggregateInput;
}
