import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { User } from '../user/user.model';
import { Room } from '../room/room.model';
import { ChannelCount } from './channel-count.output';

@ObjectType()
export class Channel {

    @Field(() => ID, {nullable:false})
    id!: bigint;

    /**
     * 频道代号
     */
    @Field(() => String, {nullable:false,description:'频道代号'})
    code!: string;

    /**
     * 频道名
     */
    @Field(() => String, {nullable:false,description:'频道名'})
    name!: string;

    /**
     * 拥有者ID
     */
    @Field(() => String, {nullable:false,description:'拥有者ID'})
    ownerUserId!: bigint;

    @Field(() => Date, {nullable:false})
    createdTime!: Date;

    @Field(() => Date, {nullable:false})
    updatedTime!: Date;

    @Field(() => Date, {nullable:true})
    deletedTime!: Date | null;

    /**
     * 拥有者
     */
    @Field(() => User, {nullable:false,description:'拥有者'})
    ownerUser?: User;

    /**
     * 频道用户
     */
    @Field(() => [User], {nullable:true,description:'频道用户'})
    users?: Array<User>;

    /**
     * 房间
     */
    @Field(() => [Room], {nullable:true,description:'房间'})
    rooms?: Array<Room>;

    @Field(() => ChannelCount, {nullable:false})
    _count?: ChannelCount;
}
