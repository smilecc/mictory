import { Field, InputType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';

@InputType()
export class ChannelJoinInput {
  @Field(() => GraphQLBigInt, { nullable: false })
  channelId: bigint;
}
