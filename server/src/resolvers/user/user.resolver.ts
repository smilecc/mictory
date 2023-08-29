import { UserInputError } from '@nestjs/apollo';
import { Args, Context, Directive, Info, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { GraphQLResolveInfo } from 'graphql';
import { nanoid } from 'nanoid';
import { CreateOneUserArgs } from 'src/@generated/user/create-one-user.args';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { UserWhereInput } from 'src/@generated/user/user-where.input';
import { User } from 'src/@generated/user/user.model';
import { UserSession } from 'src/graphql/types/user-session.output';
import { UserService } from 'src/services';
import { JwtUserClaims } from 'src/types';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  // @Directive('@auth')
  @Query(() => UserSession)
  async test(@Context('user') req) {
    return plainToClass(UserSession, {
      userId: 12,
      sessionToken: '123',
    });
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

  @Mutation(() => UserSession)
  async userCreate(@Args() args: CreateOneUserArgs): Promise<UserSession> {
    const passwordSalt = nanoid(64);
    const password = this.userService.generatePasswordHash(args.data.password, passwordSalt);

    // 查询用户名占用
    const usernameCount = await this.prisma.user.count({
      where: {
        username: args.data.username,
      },
    });

    if (usernameCount > 0) {
      throw new UserInputError('用户名已存在');
    }

    // 写入用户表
    const newUser = await this.prisma.user.create({
      data: {
        ...args.data,
        password,
        passwordSalt,
      },
    });

    // 生成token
    const sessionToken = await this.jwtService.signAsync({ userId: 1 } as JwtUserClaims);

    return {
      userId: newUser.id,
      sessionToken,
    };
  }

  @Mutation(() => UserSession)
  async userSessionCreate(@Args() args: UserCreateInput) {}
}
