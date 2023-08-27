import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { BigIntWithAggregatesFilter } from '../prisma/big-int-with-aggregates-filter.input';
import { StringWithAggregatesFilter } from '../prisma/string-with-aggregates-filter.input';
import { IntWithAggregatesFilter } from '../prisma/int-with-aggregates-filter.input';
import { DateTimeWithAggregatesFilter } from '../prisma/date-time-with-aggregates-filter.input';
import { DateTimeNullableWithAggregatesFilter } from '../prisma/date-time-nullable-with-aggregates-filter.input';

@InputType()
export class UserNicknameScalarWhereWithAggregatesInput {

    @Field(() => [UserNicknameScalarWhereWithAggregatesInput], {nullable:true})
    AND?: Array<UserNicknameScalarWhereWithAggregatesInput>;

    @Field(() => [UserNicknameScalarWhereWithAggregatesInput], {nullable:true})
    OR?: Array<UserNicknameScalarWhereWithAggregatesInput>;

    @Field(() => [UserNicknameScalarWhereWithAggregatesInput], {nullable:true})
    NOT?: Array<UserNicknameScalarWhereWithAggregatesInput>;

    @Field(() => BigIntWithAggregatesFilter, {nullable:true})
    id?: BigIntWithAggregatesFilter;

    @Field(() => StringWithAggregatesFilter, {nullable:true})
    nickname?: StringWithAggregatesFilter;

    @Field(() => IntWithAggregatesFilter, {nullable:true})
    no?: IntWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    createdTime?: DateTimeWithAggregatesFilter;

    @Field(() => DateTimeWithAggregatesFilter, {nullable:true})
    updatedTime?: DateTimeWithAggregatesFilter;

    @Field(() => DateTimeNullableWithAggregatesFilter, {nullable:true})
    deletedTime?: DateTimeNullableWithAggregatesFilter;
}
