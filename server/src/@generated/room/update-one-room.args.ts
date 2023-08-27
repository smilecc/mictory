import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { RoomUpdateInput } from './room-update.input';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { RoomWhereUniqueInput } from './room-where-unique.input';

@ArgsType()
export class UpdateOneRoomArgs {

    @Field(() => RoomUpdateInput, {nullable:false})
    @Type(() => RoomUpdateInput)
    data!: RoomUpdateInput;

    @Field(() => RoomWhereUniqueInput, {nullable:false})
    @Type(() => RoomWhereUniqueInput)
    where!: Prisma.AtLeast<RoomWhereUniqueInput, 'id'>;
}
