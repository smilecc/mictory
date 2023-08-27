import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { RoomWhereInput } from './room-where.input';
import { Type } from 'class-transformer';
import { RoomOrderByWithRelationInput } from './room-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { RoomWhereUniqueInput } from './room-where-unique.input';
import { Int } from '@nestjs/graphql';
import { RoomScalarFieldEnum } from './room-scalar-field.enum';

@ArgsType()
export class FindManyRoomArgs {

    @Field(() => RoomWhereInput, {nullable:true})
    @Type(() => RoomWhereInput)
    where?: RoomWhereInput;

    @Field(() => [RoomOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<RoomOrderByWithRelationInput>;

    @Field(() => RoomWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<RoomWhereUniqueInput, 'id'>;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => [RoomScalarFieldEnum], {nullable:true})
    distinct?: Array<keyof typeof RoomScalarFieldEnum>;
}
