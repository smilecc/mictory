import { Field, InputType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';

@InputType()
export class RoomCreateInput {
  @Field(() => String, { nullable: false, description: '房间名' })
  name: string;

  @Field(() => GraphQLBigInt, { nullable: false, description: '频道ID' })
  channelId: bigint;

  @Field(() => GraphQLBigInt, { nullable: false, description: '频道类目ID' })
  channelCategoryId: bigint;
}
