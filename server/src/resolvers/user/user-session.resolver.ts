import { Info, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { User } from 'src/@generated/user/user.model';
import { UserSession } from 'src/graphql/types/user-session.output';

@Resolver(() => UserSession)
export class UserSessionResolver {
  constructor(private readonly prisma: PrismaClient) {}

  @ResolveField(() => User)
  async user(@Parent() userSession: UserSession, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return this.prisma.user.findUnique({ where: { id: userSession.userId }, ...select });
  }
}
