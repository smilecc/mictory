import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelWhereInput } from './channel-where.input';

@InputType()
export class ChannelRelationFilter {

    @Field(() => ChannelWhereInput, {nullable:true})
    is?: ChannelWhereInput;

    @Field(() => ChannelWhereInput, {nullable:true})
    isNot?: ChannelWhereInput;
}
