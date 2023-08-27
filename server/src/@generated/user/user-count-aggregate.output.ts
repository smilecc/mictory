import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class UserCountAggregate {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    username!: number;

    @Field(() => Int, {nullable:false})
    nickname!: number;

    @Field(() => Int, {nullable:false})
    nicknameNo!: number;

    @Field(() => Int, {nullable:false})
    sessionState!: number;

    @Field(() => Int, {nullable:false})
    password!: number;

    @Field(() => Int, {nullable:false})
    passwordSalt!: number;

    @Field(() => Int, {nullable:false})
    createdTime!: number;

    @Field(() => Int, {nullable:false})
    updatedTime!: number;

    @Field(() => Int, {nullable:false})
    deletedTime!: number;

    @Field(() => Int, {nullable:false})
    _all!: number;
}
