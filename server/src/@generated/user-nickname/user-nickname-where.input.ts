import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { BigIntFilter } from '../prisma/big-int-filter.input';
import { StringFilter } from '../prisma/string-filter.input';
import { IntFilter } from '../prisma/int-filter.input';
import { DateTimeFilter } from '../prisma/date-time-filter.input';
import { DateTimeNullableFilter } from '../prisma/date-time-nullable-filter.input';

@InputType()
export class UserNicknameWhereInput {

    @Field(() => [UserNicknameWhereInput], {nullable:true})
    AND?: Array<UserNicknameWhereInput>;

    @Field(() => [UserNicknameWhereInput], {nullable:true})
    OR?: Array<UserNicknameWhereInput>;

    @Field(() => [UserNicknameWhereInput], {nullable:true})
    NOT?: Array<UserNicknameWhereInput>;

    @Field(() => BigIntFilter, {nullable:true})
    id?: BigIntFilter;

    @Field(() => StringFilter, {nullable:true})
    nickname?: StringFilter;

    @Field(() => IntFilter, {nullable:true})
    no?: IntFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    createdTime?: DateTimeFilter;

    @Field(() => DateTimeFilter, {nullable:true})
    updatedTime?: DateTimeFilter;

    @Field(() => DateTimeNullableFilter, {nullable:true})
    deletedTime?: DateTimeNullableFilter;
}
