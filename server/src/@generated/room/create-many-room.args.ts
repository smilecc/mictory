import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { RoomCreateManyInput } from './room-create-many.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateManyRoomArgs {

    @Field(() => [RoomCreateManyInput], {nullable:false})
    @Type(() => RoomCreateManyInput)
    data!: Array<RoomCreateManyInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
