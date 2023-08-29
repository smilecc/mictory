import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSession {
  @Field(() => String, { nullable: false })
  account: string;

  @Field(() => String, { nullable: false })
  password: string;
}
