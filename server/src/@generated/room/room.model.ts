import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Channel } from '../channel/channel.model';

@ObjectType()
export class Room {

    @Field(() => ID, {nullable:false})
    id!: bigint;

    @Field(() => String, {nullable:false})
    channelId!: bigint;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => Int, {nullable:false,defaultValue:50})
    maxMember!: number;

    @Field(() => Date, {nullable:false})
    createdTime!: Date;

    @Field(() => Date, {nullable:false})
    updatedTime!: Date;

    @Field(() => Date, {nullable:true})
    deletedTime!: Date | null;

    @Field(() => Channel, {nullable:false})
    channel?: Channel;
}
