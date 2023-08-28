import { Args, Context, Directive, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { nanoid } from 'nanoid';
import { CreateOneUserArgs } from 'src/@generated/user/create-one-user.args';
import { UserWhereInput } from 'src/@generated/user/user-where.input';
import { User } from 'src/@generated/user/user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  @Directive('@auth')
  @Query(() => String)
  async test(@Context('user') req) {
    console.log(req);
    return this.jwtService.signAsync({ userId: 1 });
    // return 'hello';
  }

  @Query(() => User, { nullable: true })
  async user(@Args('where') where: UserWhereInput, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    // if (where.nickname === "__MY__") {
    //   return this
    // }
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
