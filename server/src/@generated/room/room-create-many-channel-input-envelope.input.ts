import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { RoomCreateManyChannelInput } from './room-create-many-channel.input';
import { Type } from 'class-transformer';

@InputType()
export class RoomCreateManyChannelInputEnvelope {

    @Field(() => [RoomCreateManyChannelInput], {nullable:false})
    @Type(() => RoomCreateManyChannelInput)
    data!: Array<RoomCreateManyChannelInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
