import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ChannelCountAggregate } from './channel-count-aggregate.output';
import { ChannelAvgAggregate } from './channel-avg-aggregate.output';
import { ChannelSumAggregate } from './channel-sum-aggregate.output';
import { ChannelMinAggregate } from './channel-min-aggregate.output';
import { ChannelMaxAggregate } from './channel-max-aggregate.output';

@ObjectType()
export class ChannelGroupBy {

    @Field(() => String, {nullable:false})
    id!: bigint | number;

    @Field(() => String, {nullable:false})
    code!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:false})
    ownerUserId!: bigint | number;

    @Field(() => Date, {nullable:false})
    createdTime!: Date | string;

    @Field(() => Date, {nullable:false})
    updatedTime!: Date | string;

    @Field(() => Date, {nullable:true})
    deletedTime?: Date | string;

    @Field(() => ChannelCountAggregate, {nullable:true})
    _count?: ChannelCountAggregate;

    @Field(() => ChannelAvgAggregate, {nullable:true})
    _avg?: ChannelAvgAggregate;

    @Field(() => ChannelSumAggregate, {nullable:true})
    _sum?: ChannelSumAggregate;

    @Field(() => ChannelMinAggregate, {nullable:true})
    _min?: ChannelMinAggregate;

    @Field(() => ChannelMaxAggregate, {nullable:true})
    _max?: ChannelMaxAggregate;
}
