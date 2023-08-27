import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { BigIntWithAggregatesFilter } from '../prisma/big-int-with-aggregates-filter.input';
import { StringWithAggregatesFilter } from '../prisma/string-with-aggregates-filter.input';
import { DateTimeWithAggregatesFilter } from '../prisma/date-time-with-aggregates-filter.input';
import { DateTimeNullableWithAggregatesFilter } from '../prisma/date-time-nullable-with-aggregates-filter.input';

@InputType()
export class ChannelScalarWhereWithAggregatesInput {

    @Field(() => [ChannelScalarWhereWithAggregatesInput], {nullable:true})
    AND?: Array<ChannelScalarWhereWithAggregatesInput>;

    @Field(() => [ChannelScalarWhereWithAggregatesInput], {nullable:true})
    OR?: Array<ChannelScalarWhereWithAggregatesInput>;

    @Field(() => [ChannelScalarWhereWithAggregatesInput], {nullable:true})
    NOT?: Array<ChannelScalarWhereWithAggregatesInput>;

    @Field(() => BigIntWithAggregatesFilter, {nullable:true})
    id?: BigIntWithAggregatesFilter;

    @Field(() => StringWithAggregatesFilter, {nullable:true})
    code?: StringWithAggregatesFilter;

    @Field(() => StringWithAggregatesFilter, {nullable:true})
    name?: StringWithAggregatesFilter;

    @Field(() => BigIntWithAggregatesFilter, {nullable:true})
    ownerUserId?: BigIntWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    createdTime?: DateTimeWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    updatedTime?: DateTimeWithAggregatesFilter;

    @Field(() => DateTimeNullableWithAggregatesFilter, {nullable:true})
    deletedTime?: DateTimeNullableWithAggregatesFilter;
}
