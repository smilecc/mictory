import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';
import { Type } from 'class-transformer';
import { ChannelCreateWithoutUsersInput } from './channel-create-without-users.input';

@InputType()
export class ChannelCreateOrConnectWithoutUsersInput {

    @Field(() => ChannelWhereUniqueInput, {nullable:false})
    @Type(() => ChannelWhereUniqueInput)
    where!: Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>;

    @Field(() => ChannelCreateWithoutUsersInput, {nullable:false})
    @Type(() => ChannelCreateWithoutUsersInput)
    create!: ChannelCreateWithoutUsersInput;
}
