import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';
import { Type } from 'class-transformer';
import { ChannelUpdateWithoutOwnerUserInput } from './channel-update-without-owner-user.input';

@InputType()
export class ChannelUpdateWithWhereUniqueWithoutOwnerUserInput {

    @Field(() => ChannelWhereUniqueInput, {nullable:false})
    @Type(() => ChannelWhereUniqueInput)
    where!: Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>;

    @Field(() => ChannelUpdateWithoutOwnerUserInput, {nullable:false})
    @Type(() => ChannelUpdateWithoutOwnerUserInput)
    data!: ChannelUpdateWithoutOwnerUserInput;
}
