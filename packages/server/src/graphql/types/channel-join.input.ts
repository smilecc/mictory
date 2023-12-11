import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChannelJoinInput {
  @Field(() => String)
  code: string;
}
