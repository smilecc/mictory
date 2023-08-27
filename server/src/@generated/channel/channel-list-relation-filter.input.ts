import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelWhereInput } from './channel-where.input';

@InputType()
export class ChannelListRelationFilter {

    @Field(() => ChannelWhereInput, {nullable:true})
    every?: ChannelWhereInput;

    @Field(() => ChannelWhereInput, {nullable:true})
    some?: ChannelWhereInput;

    @Field(() => ChannelWhereInput, {nullable:true})
    none?: ChannelWhereInput;
}
