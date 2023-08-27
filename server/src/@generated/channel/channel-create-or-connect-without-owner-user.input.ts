import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';
import { Type } from 'class-transformer';
import { ChannelCreateWithoutOwnerUserInput } from './channel-create-without-owner-user.input';

@InputType()
export class ChannelCreateOrConnectWithoutOwnerUserInput {

    @Field(() => ChannelWhereUniqueInput, {nullable:false})
    @Type(() => ChannelWhereUniqueInput)
    where!: Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>;

    @Field(() => ChannelCreateWithoutOwnerUserInput, {nullable:false})
    @Type(() => ChannelCreateWithoutOwnerUserInput)
    create!: ChannelCreateWithoutOwnerUserInput;
}
