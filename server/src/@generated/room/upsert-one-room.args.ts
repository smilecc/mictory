import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { RoomWhereUniqueInput } from './room-where-unique.input';
import { Type } from 'class-transformer';
import { RoomCreateInput } from './room-create.input';
import { RoomUpdateInput } from './room-update.input';

@ArgsType()
export class UpsertOneRoomArgs {

    @Field(() => RoomWhereUniqueInput, {nullable:false})
    @Type(() => RoomWhereUniqueInput)
    where!: Prisma.AtLeast<RoomWhereUniqueInput, 'id'>;

    @Field(() => RoomCreateInput, {nullable:false})
    @Type(() => RoomCreateInput)
    create!: RoomCreateInput;

    @Field(() => RoomUpdateInput, {nullable:false})
    @Type(() => RoomUpdateInput)
    update!: RoomUpdateInput;
}
