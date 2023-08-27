import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { ChannelCreateInput } from './channel-create.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateOneChannelArgs {

    @Field(() => ChannelCreateInput, {nullable:false})
    @Type(() => ChannelCreateInput)
    data!: ChannelCreateInput;
}
