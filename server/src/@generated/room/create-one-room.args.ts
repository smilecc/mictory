import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { RoomCreateInput } from './room-create.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateOneRoomArgs {

    @Field(() => RoomCreateInput, {nullable:false})
    @Type(() => RoomCreateInput)
    data!: RoomCreateInput;
}
