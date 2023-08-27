import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { RoomCreateWithoutChannelInput } from './room-create-without-channel.input';
import { Type } from 'class-transformer';
import { RoomCreateOrConnectWithoutChannelInput } from './room-create-or-connect-without-channel.input';
import { RoomUpsertWithWhereUniqueWithoutChannelInput } from './room-upsert-with-where-unique-without-channel.input';
import { RoomCreateManyChannelInputEnvelope } from './room-create-many-channel-input-envelope.input';
import { Prisma } from '@prisma/client';
import { RoomWhereUniqueInput } from './room-where-unique.input';
import { RoomUpdateWithWhereUniqueWithoutChannelInput } from './room-update-with-where-unique-without-channel.input';
import { RoomUpdateManyWithWhereWithoutChannelInput } from './room-update-many-with-where-without-channel.input';
import { RoomScalarWhereInput } from './room-scalar-where.input';

@InputType()
export class RoomUpdateManyWithoutChannelNestedInput {

    @Field(() => [RoomCreateWithoutChannelInput], {nullable:true})
    @Type(() => RoomCreateWithoutChannelInput)
    create?: Array<RoomCreateWithoutChannelInput>;

    @Field(() => [RoomCreateOrConnectWithoutChannelInput], {nullable:true})
    @Type(() => RoomCreateOrConnectWithoutChannelInput)
    connectOrCreate?: Array<RoomCreateOrConnectWithoutChannelInput>;

    @Field(() => [RoomUpsertWithWhereUniqueWithoutChannelInput], {nullable:true})
    @Type(() => RoomUpsertWithWhereUniqueWithoutChannelInput)
    upsert?: Array<RoomUpsertWithWhereUniqueWithoutChannelInput>;

    @Field(() => RoomCreateManyChannelInputEnvelope, {nullable:true})
    @Type(() => RoomCreateManyChannelInputEnvelope)
    createMany?: RoomCreateManyChannelInputEnvelope;

    @Field(() => [RoomWhereUniqueInput], {nullable:true})
    @Type(() => RoomWhereUniqueInput)
    set?: Array<Prisma.AtLeast<RoomWhereUniqueInput, 'id'>>;

    @Field(() => [RoomWhereUniqueInput], {nullable:true})
    @Type(() => RoomWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<RoomWhereUniqueInput, 'id'>>;

    @Field(() => [RoomWhereUniqueInput], {nullable:true})
    @Type(() => RoomWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<RoomWhereUniqueInput, 'id'>>;

    @Field(() => [RoomWhereUniqueInput], {nullable:true})
    @Type(() => RoomWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<RoomWhereUniqueInput, 'id'>>;

    @Field(() => [RoomUpdateWithWhereUniqueWithoutChannelInput], {nullable:true})
    @Type(() => RoomUpdateWithWhereUniqueWithoutChannelInput)
    update?: Array<RoomUpdateWithWhereUniqueWithoutChannelInput>;

    @Field(() => [RoomUpdateManyWithWhereWithoutChannelInput], {nullable:true})
    @Type(() => RoomUpdateManyWithWhereWithoutChannelInput)
    updateMany?: Array<RoomUpdateManyWithWhereWithoutChannelInput>;

    @Field(() => [RoomScalarWhereInput], {nullable:true})
    @Type(() => RoomScalarWhereInput)
    deleteMany?: Array<RoomScalarWhereInput>;
}
