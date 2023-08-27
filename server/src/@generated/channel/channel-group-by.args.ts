import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { ChannelWhereInput } from './channel-where.input';
import { Type } from 'class-transformer';
import { ChannelOrderByWithAggregationInput } from './channel-order-by-with-aggregation.input';
import { ChannelScalarFieldEnum } from './channel-scalar-field.enum';
import { ChannelScalarWhereWithAggregatesInput } from './channel-scalar-where-with-aggregates.input';
import { Int } from '@nestjs/graphql';
import { ChannelCountAggregateInput } from './channel-count-aggregate.input';
import { ChannelAvgAggregateInput } from './channel-avg-aggregate.input';
import { ChannelSumAggregateInput } from './channel-sum-aggregate.input';
import { ChannelMinAggregateInput } from './channel-min-aggregate.input';
import { ChannelMaxAggregateInput } from './channel-max-aggregate.input';

@ArgsType()
export class ChannelGroupByArgs {

    @Field(() => ChannelWhereInput, {nullable:true})
    @Type(() => ChannelWhereInput)
    where?: ChannelWhereInput;

    @Field(() => [ChannelOrderByWithAggregationInput], {nullable:true})
    orderBy?: Array<ChannelOrderByWithAggregationInput>;

    @Field(() => [ChannelScalarFieldEnum], {nullable:false})
    by!: Array<keyof typeof ChannelScalarFieldEnum>;

    @Field(() => ChannelScalarWhereWithAggregatesInput, {nullable:true})
    having?: ChannelScalarWhereWithAggregatesInput;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => ChannelCountAggregateInput, {nullable:true})
    _count?: ChannelCountAggregateInput;

    @Field(() => ChannelAvgAggregateInput, {nullable:true})
    _avg?: ChannelAvgAggregateInput;

    @Field(() => ChannelSumAggregateInput, {nullable:true})
    _sum?: ChannelSumAggregateInput;

    @Field(() => ChannelMinAggregateInput, {nullable:true})
    _min?: ChannelMinAggregateInput;

    @Field(() => ChannelMaxAggregateInput, {nullable:true})
    _max?: ChannelMaxAggregateInput;
}
