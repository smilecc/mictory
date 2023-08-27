import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class RoomCountAggregate {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    channelId!: number;

    @Field(() => Int, {nullable:false})
    name!: number;

    @Field(() => Int, {nullable:false})
    maxMember!: number;

    @Field(() => Int, {nullable:false})
    createdTime!: number;

    @Field(() => Int, {nullable:false})
    updatedTime!: number;

    @Field(() => Int, {nullable:false})
    deletedTime!: number;

    @Field(() => Int, {nullable:false})
    _all!: number;
}
