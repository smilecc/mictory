import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelCreateWithoutOwnerUserInput } from './channel-create-without-owner-user.input';
import { Type } from 'class-transformer';
import { ChannelCreateOrConnectWithoutOwnerUserInput } from './channel-create-or-connect-without-owner-user.input';
import { ChannelCreateManyOwnerUserInputEnvelope } from './channel-create-many-owner-user-input-envelope.input';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';

@InputType()
export class ChannelCreateNestedManyWithoutOwnerUserInput {

    @Field(() => [ChannelCreateWithoutOwnerUserInput], {nullable:true})
    @Type(() => ChannelCreateWithoutOwnerUserInput)
    create?: Array<ChannelCreateWithoutOwnerUserInput>;

    @Field(() => [ChannelCreateOrConnectWithoutOwnerUserInput], {nullable:true})
    @Type(() => ChannelCreateOrConnectWithoutOwnerUserInput)
    connectOrCreate?: Array<ChannelCreateOrConnectWithoutOwnerUserInput>;

    @Field(() => ChannelCreateManyOwnerUserInputEnvelope, {nullable:true})
    @Type(() => ChannelCreateManyOwnerUserInputEnvelope)
    createMany?: ChannelCreateManyOwnerUserInputEnvelope;

    @Field(() => [ChannelWhereUniqueInput], {nullable:true})
    @Type(() => ChannelWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>>;
}
