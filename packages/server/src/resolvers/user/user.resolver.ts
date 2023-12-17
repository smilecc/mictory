import { Args, Context, Directive, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { nanoid } from 'nanoid';
import { User, UserWhereInput, CreateOneUserArgs } from 'src/@generated';
import { MictoryErrorCodes } from '@mictory/common';
import { UserSessionCreateInput } from 'src/graphql/types/user-session-create.input';
import { UserSession } from 'src/graphql/types/user-session.output';
import { UserService } from 'src/services';
import { CreateMictoryError } from 'src/utils';
import { CTX_USER } from 'src/consts';
import { RequestUser } from 'src/modules/auth.module';
import { UserFriend } from 'src/@generated';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaClient,
  ) {}

  @Directive('@user')
  @Query(() => GraphQLBigInt)
  async test(@Context(CTX_USER) user: RequestUser) {
    return user.userId;
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('where') where: UserWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Context(CTX_USER) user: RequestUser,
  ) {
    const select = new PrismaSelect(info).value;

    // 约定-1为查询当前用户
    if (where.nicknameNo?.equals === -1) {
      if (!user?.userId) return null;

      return this.prisma.user.findFirst({
        where: {
          id: user.userId,
        },
        ...select,
      });
    }

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
      throw CreateMictoryError(MictoryErrorCodes.USER_EXISTED);
    }

    // 写入用户表
    const newUser = await this.userService.createUser({
      ...args.data,
      password,
      passwordSalt,
    });

    // 生成token
    const sessionToken = await this.userService.generateSessionToken(newUser);

    return {
      userId: newUser.id,
      sessionToken,
    };
  }

  @Mutation(() => UserSession)
  async userSessionCreate(@Args('args') args: UserSessionCreateInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: args.account,
      },
    });

    if (!user) {
      throw CreateMictoryError(MictoryErrorCodes.PASSWORD_WRONG);
    }

    if (user.password !== this.userService.generatePasswordHash(args.password, user.passwordSalt)) {
      throw CreateMictoryError(MictoryErrorCodes.PASSWORD_WRONG);
    }

    return plainToClass(UserSession, {
      userId: user.id,
      sessionToken: await this.userService.generateSessionToken(user),
    } as UserSession);
  }

  @Directive('@user')
  @Query(() => [UserFriend], { description: '用户好友列表' })
  async userFriends(@Context(CTX_USER) user: RequestUser, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;

    return this.prisma.userFriend.findMany({
      ...select,
      where: {
        OR: [
          {
            userAId: user.userId,
          },
          {
            userBId: user.userId,
          },
        ],
      },
      orderBy: {
        lastChatTime: 'desc',
      },
    });
  }
}
