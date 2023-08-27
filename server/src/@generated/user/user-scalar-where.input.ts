import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { BigIntFilter } from '../prisma/big-int-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntFilter } from '../prisma/int-filter.input';
import { EnumUserSessionStateFilter } from '../prisma/enum-user-session-state-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { DateTimeNullableFilter } from '../prisma/date-time-nullable-filter.input';

@InputType()
export class UserScalarWhereInput {

    @Field(() => [UserScalarWhereInput], {nullable:true})
    AND?: Array<UserScalarWhereInput>;

    @Field(() => [UserScalarWhereInput], {nullable:true})
    OR?: Array<UserScalarWhereInput>;

    @Field(() => [UserScalarWhereInput], {nullable:true})
    NOT?: Array<UserScalarWhereInput>;

    @Field(() => BigIntFilter, {nullable:true})
    id?: BigIntFilter;

    @Field(() => StringFilter, {nullable:true})
    username?: StringFilter;

    @Field(() => StringFilter, {nullable:true})
    nickname?: StringFilter;

    @Field(() => IntFilter, {nullable:true})
    nicknameNo?: IntFilter;

    @Field(() => EnumUserSessionStateFilter, {nullable:true})
    sessionState?: EnumUserSessionStateFilter;

    @Field(() => StringFilter, {nullable:true})
    password?: StringFilter;

    @Field(() => StringFilter, {nullable:true})
    passwordSalt?: StringFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    createdTime?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedTime?: DateTimeFilter;

    @Field(() => DateTimeNullableFilter, {nullable:true})
    deletedTime?: DateTimeNullableFilter;
}
