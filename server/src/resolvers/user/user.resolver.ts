import { Directive, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/@generated/user/user.model';

@Resolver(() => User)
export class UserResolver {
  @Directive('@auth')
  @Query(() => String)
  async test() {
    return 'hello';
  }
}
