import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { BigIntFilter } from '../prisma/big-int-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { DateTimeNullableFilter } from '../prisma/date-time-nullable-filter.input';

@InputType()
export class ChannelScalarWhereInput {

    @Field(() => [ChannelScalarWhereInput], {nullable:true})
    AND?: Array<ChannelScalarWhereInput>;

    @Field(() => [ChannelScalarWhereInput], {nullable:true})
    OR?: Array<ChannelScalarWhereInput>;

    @Field(() => [ChannelScalarWhereInput], {nullable:true})
    NOT?: Array<ChannelScalarWhereInput>;

    @Field(() => BigIntFilter, {nullable:true})
    id?: BigIntFilter;

    @Field(() => StringFilter, {nullable:true})
    code?: StringFilter;

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
}
