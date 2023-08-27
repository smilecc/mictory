import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelWhereInput } from './channel-where.input';
import { Type } from 'class-transformer';
import { ChannelUpdateWithoutRoomsInput } from './channel-update-without-rooms.input';

@InputType()
export class ChannelUpdateToOneWithWhereWithoutRoomsInput {

    @Field(() => ChannelWhereInput, {nullable:true})
    @Type(() => ChannelWhereInput)
    where?: ChannelWhereInput;

    @Field(() => ChannelUpdateWithoutRoomsInput, {nullable:false})
    @Type(() => ChannelUpdateWithoutRoomsInput)
    data!: ChannelUpdateWithoutRoomsInput;
}
