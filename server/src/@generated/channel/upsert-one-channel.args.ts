import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';
import { Type } from 'class-transformer';
import { ChannelCreateInput } from './channel-create.input';
import { ChannelUpdateInput } from './channel-update.input';

@ArgsType()
export class UpsertOneChannelArgs {

    @Field(() => ChannelWhereUniqueInput, {nullable:false})
    @Type(() => ChannelWhereUniqueInput)
    where!: Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>;

    @Field(() => ChannelCreateInput, {nullable:false})
    @Type(() => ChannelCreateInput)
    create!: ChannelCreateInput;

    @Field(() => ChannelUpdateInput, {nullable:false})
    @Type(() => ChannelUpdateInput)
    update!: ChannelUpdateInput;
}
