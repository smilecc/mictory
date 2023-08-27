import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { ChannelWhereInput } from './channel-where.input';
import { Type } from 'class-transformer';
import { ChannelOrderByWithRelationInput } from './channel-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';
import { Int } from '@nestjs/graphql';
import { ChannelScalarFieldEnum } from './channel-scalar-field.enum';

@ArgsType()
export class FindFirstChannelOrThrowArgs {

    @Field(() => ChannelWhereInput, {nullable:true})
    @Type(() => ChannelWhereInput)
    where?: ChannelWhereInput;

    @Field(() => [ChannelOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<ChannelOrderByWithRelationInput>;

    @Field(() => ChannelWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => [ChannelScalarFieldEnum], {nullable:true})
    distinct?: Array<keyof typeof ChannelScalarFieldEnum>;
}
