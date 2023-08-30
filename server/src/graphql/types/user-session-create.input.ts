import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserSessionCreateInput {
  @Field(() => String, { nullable: false })
  account: string;

  @Field(() => String, { nullable: false })
  password: string;
}
