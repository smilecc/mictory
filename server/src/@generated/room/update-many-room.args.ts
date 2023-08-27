import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { RoomUpdateManyMutationInput } from './room-update-many-mutation.input';
import { Type } from 'class-transformer';
import { RoomWhereInput } from './room-where.input';

@ArgsType()
export class UpdateManyRoomArgs {

    @Field(() => RoomUpdateManyMutationInput, {nullable:false})
    @Type(() => RoomUpdateManyMutationInput)
    data!: RoomUpdateManyMutationInput;

    @Field(() => RoomWhereInput, {nullable:true})
    @Type(() => RoomWhereInput)
    where?: RoomWhereInput;
}
