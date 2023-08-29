import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { User } from 'src/@generated/user/user.model';

@ObjectType()
export class UserSession {
  @Field(() => GraphQLBigInt, { nullable: false })
  userId: bigint;

  @Field(() => String, { nullable: false })
  sessionToken: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
