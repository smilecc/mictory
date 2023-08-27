import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelCreateWithoutUsersInput } from './channel-create-without-users.input';
import { Type } from 'class-transformer';
import { ChannelCreateOrConnectWithoutUsersInput } from './channel-create-or-connect-without-users.input';
import { Prisma } from '@prisma/client';
import { ChannelWhereUniqueInput } from './channel-where-unique.input';

@InputType()
export class ChannelCreateNestedManyWithoutUsersInput {

    @Field(() => [ChannelCreateWithoutUsersInput], {nullable:true})
    @Type(() => ChannelCreateWithoutUsersInput)
    create?: Array<ChannelCreateWithoutUsersInput>;

    @Field(() => [ChannelCreateOrConnectWithoutUsersInput], {nullable:true})
    @Type(() => ChannelCreateOrConnectWithoutUsersInput)
    connectOrCreate?: Array<ChannelCreateOrConnectWithoutUsersInput>;

    @Field(() => [ChannelWhereUniqueInput], {nullable:true})
    @Type(() => ChannelWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<ChannelWhereUniqueInput, 'id' | 'code'>>;
}
