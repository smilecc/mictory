import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { RoomWhereInput } from './room-where.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteManyRoomArgs {

    @Field(() => RoomWhereInput, {nullable:true})
    @Type(() => RoomWhereInput)
    where?: RoomWhereInput;
}
