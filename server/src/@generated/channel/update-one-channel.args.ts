import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { ChannelUpdateInput } from './channel-update.input';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';

@ArgsType()
export class UpdateOneChannelArgs {

    @Field(() => ChannelUpdateInput, {nullable:false})
    @Type(() => ChannelUpdateInput)
    data!: ChannelUpdateInput;

    @Field(() => ChannelWhereUniqueInput, {nullable:false})
    @Type(() => ChannelWhereUniqueInput)
    where!: Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>;
}
