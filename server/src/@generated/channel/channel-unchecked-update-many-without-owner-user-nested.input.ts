import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelCreateWithoutOwnerUserInput } from './channel-create-without-owner-user.input';
import { Type } from 'class-transformer';
import { ChannelCreateOrConnectWithoutOwnerUserInput } from './channel-create-or-connect-without-owner-user.input';
import { ChannelUpsertWithWhereUniqueWithoutOwnerUserInput } from './channel-upsert-with-where-unique-without-owner-user.input';
import { ChannelCreateManyOwnerUserInputEnvelope } from './channel-create-many-owner-user-input-envelope.input';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';
import { ChannelUpdateWithWhereUniqueWithoutOwnerUserInput } from './channel-update-with-where-unique-without-owner-user.input';
import { ChannelUpdateManyWithWhereWithoutOwnerUserInput } from './channel-update-many-with-where-without-owner-user.input';
import { ChannelScalarWhereInput } from './channel-scalar-where.input';

@InputType()
export class ChannelUncheckedUpdateManyWithoutOwnerUserNestedInput {

    @Field(() => [ChannelCreateWithoutOwnerUserInput], {nullable:true})
    @Type(() => ChannelCreateWithoutOwnerUserInput)
    create?: Array<ChannelCreateWithoutOwnerUserInput>;

    @Field(() => [ChannelCreateOrConnectWithoutOwnerUserInput], {nullable:true})
    @Type(() => ChannelCreateOrConnectWithoutOwnerUserInput)
    connectOrCreate?: Array<ChannelCreateOrConnectWithoutOwnerUserInput>;

    @Field(() => [ChannelUpsertWithWhereUniqueWithoutOwnerUserInput], {nullable:true})
    @Type(() => ChannelUpsertWithWhereUniqueWithoutOwnerUserInput)
    upsert?: Array<ChannelUpsertWithWhereUniqueWithoutOwnerUserInput>;

    @Field(() => ChannelCreateManyOwnerUserInputEnvelope, {nullable:true})
    @Type(() => ChannelCreateManyOwnerUserInputEnvelope)
    createMany?: ChannelCreateManyOwnerUserInputEnvelope;

    @Field(() => [ChannelWhereUniqueInput], {nullable:true})
    @Type(() => ChannelWhereUniqueInput)
    set?: Array<Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>>;

    @Field(() => [ChannelWhereUniqueInput], {nullable:true})
    @Type(() => ChannelWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>>;

    @Field(() => [ChannelWhereUniqueInput], {nullable:true})
    @Type(() => ChannelWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>>;

    @Field(() => [ChannelWhereUniqueInput], {nullable:true})
    @Type(() => ChannelWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>>;

    @Field(() => [ChannelUpdateWithWhereUniqueWithoutOwnerUserInput], {nullable:true})
    @Type(() => ChannelUpdateWithWhereUniqueWithoutOwnerUserInput)
    update?: Array<ChannelUpdateWithWhereUniqueWithoutOwnerUserInput>;

    @Field(() => [ChannelUpdateManyWithWhereWithoutOwnerUserInput], {nullable:true})
    @Type(() => ChannelUpdateManyWithWhereWithoutOwnerUserInput)
    updateMany?: Array<ChannelUpdateManyWithWhereWithoutOwnerUserInput>;

    @Field(() => [ChannelScalarWhereInput], {nullable:true})
    @Type(() => ChannelScalarWhereInput)
    deleteMany?: Array<ChannelScalarWhereInput>;
}
