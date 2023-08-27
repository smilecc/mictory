import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelCreateWithoutUsersInput } from './channel-create-without-users.input';
import { Type } from 'class-transformer';
import { ChannelCreateOrConnectWithoutUsersInput } from './channel-create-or-connect-without-users.input';
import { ChannelUpsertWithWhereUniqueWithoutUsersInput } from './channel-upsert-with-where-unique-without-users.input';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';
import { ChannelUpdateWithWhereUniqueWithoutUsersInput } from './channel-update-with-where-unique-without-users.input';
import { ChannelUpdateManyWithWhereWithoutUsersInput } from './channel-update-many-with-where-without-users.input';
import { ChannelScalarWhereInput } from './channel-scalar-where.input';

@InputType()
export class ChannelUncheckedUpdateManyWithoutUsersNestedInput {

    @Field(() => [ChannelCreateWithoutUsersInput], {nullable:true})
    @Type(() => ChannelCreateWithoutUsersInput)
    create?: Array<ChannelCreateWithoutUsersInput>;

    @Field(() => [ChannelCreateOrConnectWithoutUsersInput], {nullable:true})
    @Type(() => ChannelCreateOrConnectWithoutUsersInput)
    connectOrCreate?: Array<ChannelCreateOrConnectWithoutUsersInput>;

    @Field(() => [ChannelUpsertWithWhereUniqueWithoutUsersInput], {nullable:true})
    @Type(() => ChannelUpsertWithWhereUniqueWithoutUsersInput)
    upsert?: Array<ChannelUpsertWithWhereUniqueWithoutUsersInput>;

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

    @Field(() => [ChannelUpdateWithWhereUniqueWithoutUsersInput], {nullable:true})
    @Type(() => ChannelUpdateWithWhereUniqueWithoutUsersInput)
    update?: Array<ChannelUpdateWithWhereUniqueWithoutUsersInput>;

    @Field(() => [ChannelUpdateManyWithWhereWithoutUsersInput], {nullable:true})
    @Type(() => ChannelUpdateManyWithWhereWithoutUsersInput)
    updateMany?: Array<ChannelUpdateManyWithWhereWithoutUsersInput>;

    @Field(() => [ChannelScalarWhereInput], {nullable:true})
    @Type(() => ChannelScalarWhereInput)
    deleteMany?: Array<ChannelScalarWhereInput>;
}
