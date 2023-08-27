import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { RoomWhereInput } from './room-where.input';

@InputType()
export class RoomListRelationFilter {

    @Field(() => RoomWhereInput, {nullable:true})
    every?: RoomWhereInput;

    @Field(() => RoomWhereInput, {nullable:true})
    some?: RoomWhereInput;

    @Field(() => RoomWhereInput, {nullable:true})
    none?: RoomWhereInput;
}
