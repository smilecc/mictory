import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelWhereInput } from './channel-where.input';
import { StringFilter } from '../prisma/string-filter.input';
import { BigIntFilter } from '../prisma/big-int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { DateTimeNullableFilter } from '../prisma/date-time-nullable-filter.input';
import { UserRelationFilter } from '../user/user-relation-filter.input';
import { UserListRelationFilter } from '../user/user-list-relation-filter.input';
import { RoomListRelationFilter } from '../room/room-list-relation-filter.input';

@InputType()
export class ChannelWhereUniqueInput {

    @Field(() => String, {nullable:true})
    id?: bigint | number;

    @Field(() => String, {nullable:true})
    code?: string;

    @Field(() => [ChannelWhereInput], {nullable:true})
    AND?: Array<ChannelWhereInput>;

    @Field(() => [ChannelWhereInput], {nullable:true})
    OR?: Array<ChannelWhereInput>;

    @Field(() => [ChannelWhereInput], {nullable:true})
    NOT?: Array<ChannelWhereInput>;

    @Field(() => StringFilter, {nullable:true})
    name?: StringFilter;

    @Field(() => BigIntFilter, {nullable:true})
    ownerUserId?: BigIntFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    createdTime?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedTime?: DateTimeFilter;

    @Field(() => DateTimeNullableFilter, {nullable:true})
    deletedTime?: DateTimeNullableFilter;

    @Field(() => UserRelationFilter, {nullable:true})
    ownerUser?: UserRelationFilter;

    @Field(() => UserListRelationFilter, {nullable:true})
    users?: UserListRelationFilter;

    @Field(() => RoomListRelationFilter, {nullable:true})
    rooms?: RoomListRelationFilter;
}
