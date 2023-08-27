import { Args, Directive, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { nanoid } from 'nanoid';
import { CreateOneUserArgs } from 'src/@generated/user/create-one-user.args';
import { UserWhereInput } from 'src/@generated/user/user-where.input';
import { User } from 'src/@generated/user/user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly prisma: PrismaClient) {}

  @Directive('@auth')
  @Query(() => String)
  async test() {
    return 'hello';
  }

  @Query(() => User, { nullable: true })
  async user(@Args('where') where: UserWhereInput, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return this.prisma.user.findFirst({ where, ...select });
  }

  @Mutation(() => User)
  async userCreate(@Args() args: CreateOneUserArgs) {
    const passwordSalt = nanoid(64);
    return await this.prisma.user.create({
      data: {
        ...args.data,
        passwordSalt,
      },
    });
  }
}
