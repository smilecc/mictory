import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserCreateWithoutChannelsInput } from './user-create-without-channels.input';
import { Type } from 'class-transformer';
import { UserCreateOrConnectWithoutChannelsInput } from './user-create-or-connect-without-channels.input';
import { Prisma } from '@prisma/client';
import { UserWhereUniqueInput } from './user-where-unique.input';

@InputType()
export class UserCreateNestedManyWithoutChannelsInput {

    @Field(() => [UserCreateWithoutChannelsInput], {nullable:true})
    @Type(() => UserCreateWithoutChannelsInput)
    create?: Array<UserCreateWithoutChannelsInput>;

    @Field(() => [UserCreateOrConnectWithoutChannelsInput], {nullable:true})
    @Type(() => UserCreateOrConnectWithoutChannelsInput)
    connectOrCreate?: Array<UserCreateOrConnectWithoutChannelsInput>;

    @Field(() => [UserWhereUniqueInput], {nullable:true})
    @Type(() => UserWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'username'>>;
}
