import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '用户资料更新入参' })
export class UserProfileUpdateInput {
  @Field(() => String, { nullable: true, description: '头像' })
  avatar: string;

  @Field(() => String, { nullable: true, description: '个人介绍' })
  intro: string;

  @Field(() => String, { nullable: true, description: '资料横幅' })
  profileBanner: string;
}
