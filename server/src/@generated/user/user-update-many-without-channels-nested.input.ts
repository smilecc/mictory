import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserCreateWithoutChannelsInput } from './user-create-without-channels.input';
import { Type } from 'class-transformer';
import { UserCreateOrConnectWithoutChannelsInput } from './user-create-or-connect-without-channels.input';
import { UserUpsertWithWhereUniqueWithoutChannelsInput } from './user-upsert-with-where-unique-without-channels.input';
import { Prisma } from '@prisma/client';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { UserUpdateWithWhereUniqueWithoutChannelsInput } from './user-update-with-where-unique-without-channels.input';
import { UserUpdateManyWithWhereWithoutChannelsInput } from './user-update-many-with-where-without-channels.input';
import { UserScalarWhereInput } from './user-scalar-where.input';

@InputType()
export class UserUpdateManyWithoutChannelsNestedInput {

    @Field(() => [UserCreateWithoutChannelsInput], {nullable:true})
    @Type(() => UserCreateWithoutChannelsInput)
    create?: Array<UserCreateWithoutChannelsInput>;

    @Field(() => [UserCreateOrConnectWithoutChannelsInput], {nullable:true})
    @Type(() => UserCreateOrConnectWithoutChannelsInput)
    connectOrCreate?: Array<UserCreateOrConnectWithoutChannelsInput>;

    @Field(() => [UserUpsertWithWhereUniqueWithoutChannelsInput], {nullable:true})
    @Type(() => UserUpsertWithWhereUniqueWithoutChannelsInput)
    upsert?: Array<UserUpsertWithWhereUniqueWithoutChannelsInput>;

    @Field(() => [UserWhereUniqueInput], {nullable:true})
    @Type(() => UserWhereUniqueInput)
    set?: Array<Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'username'>>;

    @Field(() => [UserWhereUniqueInput], {nullable:true})
    @Type(() => UserWhereUniqueInput)
    disconnect?: Array<Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'username'>>;

    @Field(() => [UserWhereUniqueInput], {nullable:true})
    @Type(() => UserWhereUniqueInput)
    delete?: Array<Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'username'>>;

    @Field(() => [UserWhereUniqueInput], {nullable:true})
    @Type(() => UserWhereUniqueInput)
    connect?: Array<Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'username'>>;

    @Field(() => [UserUpdateWithWhereUniqueWithoutChannelsInput], {nullable:true})
    @Type(() => UserUpdateWithWhereUniqueWithoutChannelsInput)
    update?: Array<UserUpdateWithWhereUniqueWithoutChannelsInput>;

    @Field(() => [UserUpdateManyWithWhereWithoutChannelsInput], {nullable:true})
    @Type(() => UserUpdateManyWithWhereWithoutChannelsInput)
    updateMany?: Array<UserUpdateManyWithWhereWithoutChannelsInput>;

    @Field(() => [UserScalarWhereInput], {nullable:true})
    @Type(() => UserScalarWhereInput)
    deleteMany?: Array<UserScalarWhereInput>;
}
