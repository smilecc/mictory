import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { BigIntFilter } from '../prisma/big-int-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { DateTimeNullableFilter } from '../prisma/date-time-nullable-filter.input';

@InputType()
export class RoomScalarWhereInput {

    @Field(() => [RoomScalarWhereInput], {nullable:true})
    AND?: Array<RoomScalarWhereInput>;

    @Field(() => [RoomScalarWhereInput], {nullable:true})
    OR?: Array<RoomScalarWhereInput>;

    @Field(() => [RoomScalarWhereInput], {nullable:true})
    NOT?: Array<RoomScalarWhereInput>;

    @Field(() => BigIntFilter, {nullable:true})
    id?: BigIntFilter;

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
}
