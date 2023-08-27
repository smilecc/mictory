import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { ChannelWhereInput } from './channel-where.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteManyChannelArgs {

    @Field(() => ChannelWhereInput, {nullable:true})
    @Type(() => ChannelWhereInput)
    where?: ChannelWhereInput;
}
