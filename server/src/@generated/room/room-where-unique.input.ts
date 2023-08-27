import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { RoomWhereInput } from './room-where.input';
import { BigIntFilter } from '../prisma/big-int-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { DateTimeNullableFilter } from '../prisma/date-time-nullable-filter.input';
import { ChannelRelationFilter } from '../channel/channel-relation-filter.input';

@InputType()
export class RoomWhereUniqueInput {

    @Field(() => String, {nullable:true})
    id?: bigint | number;

    @Field(() => [RoomWhereInput], {nullable:true})
    AND?: Array<RoomWhereInput>;

    @Field(() => [RoomWhereInput], {nullable:true})
    OR?: Array<RoomWhereInput>;

    @Field(() => [RoomWhereInput], {nullable:true})
    NOT?: Array<RoomWhereInput>;

    @Field(() => BigIntFilter, {nullable:true})
    channelId?: BigIntFilter;

    @Field(() => StringFilter, {nullable:true})
    name?: StringFilter;

    @Field(() => IntFilter, {nullable:true})
    maxMember?: IntFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    createdTime?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedTime?: DateTimeFilter;

    @Field(() => DateTimeNullableFilter, {nullable:true})
    deletedTime?: DateTimeNullableFilter;

    @Field(() => ChannelRelationFilter, {nullable:true})
    channel?: ChannelRelationFilter;
}
