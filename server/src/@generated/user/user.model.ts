import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { UserSessionState } from '../prisma/user-session-state.enum';
import { Channel } from '../channel/channel.model';
import { UserCount } from './user-count.output';

/**
 * 用户表
 */
@ObjectType({description:'用户表'})
export class User {

    @Field(() => ID, {nullable:false})
    id!: bigint;

    /**
     * 用户名
     */
    @Field(() => String, {nullable:false,description:'用户名'})
    username!: string;

    /**
     * 昵称
     */
    @Field(() => String, {nullable:false,description:'昵称'})
    nickname!: string;

    /**
     * 昵称编号
     */
    @Field(() => Int, {nullable:false,description:'昵称编号'})
    nicknameNo!: number;

    /**
     * 在线状态
     */
    @Field(() => UserSessionState, {nullable:false,defaultValue:'OFFLINE',description:'在线状态'})
    sessionState!: keyof typeof UserSessionState;

    /**
     * 密码
     */
    @Field(() => String, {nullable:false,description:'密码'})
    password!: string;

    /**
     * 密码盐
     */
    @Field(() => String, {nullable:false,description:'密码盐'})
    passwordSalt!: string;

    @Field(() => Date, {nullable:false})
    createdTime!: Date;

    @Field(() => Date, {nullable:false})
    updatedTime!: Date;

    @Field(() => Date, {nullable:true})
    deletedTime!: Date | null;

    /**
     * 拥有的频道
     */
    @Field(() => [Channel], {nullable:true,description:'拥有的频道'})
    ownedChannels?: Array<Channel>;

    /**
     * 加入的频道
     */
    @Field(() => [Channel], {nullable:true,description:'加入的频道'})
    channels?: Array<Channel>;

    @Field(() => UserCount, {nullable:false})
    _count?: UserCount;
}
