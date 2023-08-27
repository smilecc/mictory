import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { RoomCountAggregate } from './room-count-aggregate.output';
import { RoomAvgAggregate } from './room-avg-aggregate.output';
import { RoomSumAggregate } from './room-sum-aggregate.output';
import { RoomMinAggregate } from './room-min-aggregate.output';
import { RoomMaxAggregate } from './room-max-aggregate.output';

@ObjectType()
export class RoomGroupBy {

    @Field(() => String, {nullable:false})
    id!: bigint | number;

    @Field(() => String, {nullable:false})
    channelId!: bigint | number;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => Int, {nullable:false})
    maxMember!: number;

    @Field(() => Date, {nullable:false})
    createdTime!: Date | string;

    @Field(() => Date, {nullable:false})
    updatedTime!: Date | string;

    @Field(() => Date, {nullable:true})
    deletedTime?: Date | string;

    @Field(() => RoomCountAggregate, {nullable:true})
    _count?: RoomCountAggregate;

    @Field(() => RoomAvgAggregate, {nullable:true})
    _avg?: RoomAvgAggregate;

    @Field(() => RoomSumAggregate, {nullable:true})
    _sum?: RoomSumAggregate;

    @Field(() => RoomMinAggregate, {nullable:true})
    _min?: RoomMinAggregate;

    @Field(() => RoomMaxAggregate, {nullable:true})
    _max?: RoomMaxAggregate;
}
