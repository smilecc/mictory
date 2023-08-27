import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { RoomScalarWhereInput } from './room-scalar-where.input';
import { Type } from 'class-transformer';
import { RoomUpdateManyMutationInput } from './room-update-many-mutation.input';

@InputType()
export class RoomUpdateManyWithWhereWithoutChannelInput {

    @Field(() => RoomScalarWhereInput, {nullable:false})
    @Type(() => RoomScalarWhereInput)
    where!: RoomScalarWhereInput;

    @Field(() => RoomUpdateManyMutationInput, {nullable:false})
    @Type(() => RoomUpdateManyMutationInput)
    data!: RoomUpdateManyMutationInput;
}
