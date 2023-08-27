import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelUpdateWithoutRoomsInput } from './channel-update-without-rooms.input';
import { Type } from 'class-transformer';
import { ChannelCreateWithoutRoomsInput } from './channel-create-without-rooms.input';
import { ChannelWhereInput } from './channel-where.input';

@InputType()
export class ChannelUpsertWithoutRoomsInput {

    @Field(() => ChannelUpdateWithoutRoomsInput, {nullable:false})
    @Type(() => ChannelUpdateWithoutRoomsInput)
    update!: ChannelUpdateWithoutRoomsInput;

    @Field(() => ChannelCreateWithoutRoomsInput, {nullable:false})
    @Type(() => ChannelCreateWithoutRoomsInput)
    create!: ChannelCreateWithoutRoomsInput;

    @Field(() => ChannelWhereInput, {nullable:true})
    @Type(() => ChannelWhereInput)
    where?: ChannelWhereInput;
}
