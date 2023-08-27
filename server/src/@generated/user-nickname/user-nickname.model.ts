import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

/**
 * 用户昵称表
 */
@ObjectType({description:'用户昵称表'})
export class UserNickname {

    @Field(() => ID, {nullable:false})
    id!: bigint;

    /**
     * 昵称
     */
    @Field(() => String, {nullable:false,description:'昵称'})
    nickname!: string;

    /**
     * 昵称编号
     */
    @Field(() => Int, {nullable:false,description:'昵称编号'})
    no!: number;

    @Field(() => Date, {nullable:false})
    createdTime!: Date;

    @Field(() => Date, {nullable:false})
    updatedTime!: Date;

    @Field(() => Date, {nullable:true})
    deletedTime!: Date | null;
}
