import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class ChannelCountAggregate {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    code!: number;

    @Field(() => Int, {nullable:false})
    name!: number;

    @Field(() => Int, {nullable:false})
    ownerUserId!: number;

    @Field(() => Int, {nullable:false})
    createdTime!: number;

    @Field(() => Int, {nullable:false})
    updatedTime!: number;

    @Field(() => Int, {nullable:false})
    deletedTime!: number;

    @Field(() => Int, {nullable:false})
    _all!: number;
}
