import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';
import { Type } from 'class-transformer';
import { ChannelUpdateWithoutUsersInput } from './channel-update-without-users.input';

@InputType()
export class ChannelUpdateWithWhereUniqueWithoutUsersInput {

    @Field(() => ChannelWhereUniqueInput, {nullable:false})
    @Type(() => ChannelWhereUniqueInput)
    where!: Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>;

    @Field(() => ChannelUpdateWithoutUsersInput, {nullable:false})
    @Type(() => ChannelUpdateWithoutUsersInput)
    data!: ChannelUpdateWithoutUsersInput;
}
