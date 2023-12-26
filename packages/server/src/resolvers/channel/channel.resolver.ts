import { UserInputError } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Info, Mutation, Context, Directive, ResolveField, Parent, Int } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import * as dayjs from 'dayjs';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { ChannelInvite } from 'src/@generated';
import { ChannelToUser } from 'src/@generated';
import { Channel, CreateOneChannelArgs, FindManyChannelArgs, UpdateOneChannelArgs } from 'src/@generated';
import { createModuleCallLog } from 'src/aspects';
import { CTX_USER } from 'src/consts';
import { ChannelJoinInput } from 'src/graphql/types/channel-join.input';
import { RoomManager } from 'src/manager';
import { TxManager } from 'src/manager/tx.manager';
import { RequestUser } from 'src/modules/auth.module';
import { urlNanoid } from 'src/utils';

const ModuleCallLog = createModuleCallLog('ChannelResolver');

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly txManager: TxManager,
    private readonly roomManager: RoomManager,
  ) {}

  private readonly logger = new Logger(ChannelResolver.name);

  @Query(() => [Channel], { nullable: 'items' })
  async channels(@Args() args: FindManyChannelArgs, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return this.prisma.channel.findMany({ ...args, ...select });
  }

  @Directive('@user')
  @Mutation(() => Channel)
  async channelCreate(@Context(CTX_USER) user: RequestUser, @Args() args: CreateOneChannelArgs) {
    return this.roomManager.createChannel(user.userId, args.data);
  }

  @Directive('@user')
  @Mutation(() => Channel)
  async channelUpdate(
    @Context(CTX_USER) user: RequestUser,
    @Args() args: UpdateOneChannelArgs,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = new PrismaSelect(info).value;
    const channel = await this.prisma.channel.findFirst({ where: args.where, select: { id: true } });

    // 判断用户是否有权限更新
    if (!(await this.roomManager.checkChannelPerimissions(user.userId, channel.id, 'ADMIN'))) {
      throw new UserInputError('您没有该频道的管理权限');
    }

    this.logger.log(`ChannelUpdate, User: ${user.userId} OldChannel: ${channel} Data: ${args.data}`);
    return this.prisma.channel.update({
      ...select,
      data: args.data,
      where: {
        id: channel.id,
      },
    });
  }

  @Directive('@user')
  @ResolveField(() => ChannelToUser, { nullable: true, description: 'Current user in channel' })
  async currentUser(@Context(CTX_USER) user: RequestUser, @Info() info: GraphQLResolveInfo, @Parent() parent: Channel) {
    const select = new PrismaSelect(info).value;

    return this.prisma.channelToUser.findUnique({
      where: {
        userId_channelId: {
          userId: user.userId,
          channelId: parent.id,
        },
      },
      ...select,
    });
  }

  @Directive('@user')
  @Mutation(() => Channel)
  async channelJoin(
    @Context(CTX_USER) user: RequestUser,
    @Args('data') args: ChannelJoinInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    const code = args.code.substring(args.code.lastIndexOf('/'));
    const channel = await this.prisma.channel.findFirst({
      where: {
        invites: {
          some: {
            code,
          },
        },
      },
    });

    if (!channel) {
      throw new UserInputError('加入频道失败，链接已过期');
    }

    const select = new PrismaSelect(info).value;
    const defaultRole = await this.prisma.channelRole.findFirst({
      where: {
        channelId: channel.id,
        defaultRole: true,
      },
    });

    return this.prisma.channel.update({
      ...select,
      where: {
        id: channel.id,
      },
      data: {
        users: {
          connectOrCreate: {
            where: {
              userId_channelId: {
                userId: user.userId,
                channelId: channel.id,
              },
            },
            create: {
              channelRole: { connect: { id: defaultRole.id } },
              user: { connect: { id: user.userId } },
            },
          },
        },
      },
    });
  }

  @Directive('@user')
  @Mutation(() => Boolean)
  @ModuleCallLog<ChannelResolver['channelExit']>((u, id) => `User exit channel, userId: ${u.userId}, channelId: ${id}`)
  async channelExit(@Context(CTX_USER) user: RequestUser, @Args('id', { type: () => GraphQLBigInt }) id: bigint) {
    await this.prisma.channelToUser.delete({
      where: {
        userId_channelId: {
          userId: user.userId,
          channelId: id,
        },
      },
    });

    return true;
  }

  @Directive('@user')
  @Mutation(() => ChannelInvite)
  @ModuleCallLog<ChannelResolver['channelCreateInvite']>(
    (u, id) => `User create channel invite, userId: ${u.userId}, channelId: ${id}`,
  )
  async channelCreateInvite(
    @Context(CTX_USER) user: RequestUser,
    @Args('id', { type: () => GraphQLBigInt }) id: bigint,
    @Args('days', { type: () => Int, defaultValue: 7 }) days: number,
  ) {
    if (!(await this.roomManager.checkChannelPerimissions(user.userId, id, 'INVITE'))) {
      throw new UserInputError('您暂无权限创建邀请链接');
    }

    // 同一用户&同一频道，一天创建一次
    const today = dayjs().endOf('day').toDate();
    const invite = await this.prisma.channelInvite.findFirst({
      where: {
        userId: user.userId,
        channelId: id,
        days,
        createdTime: {
          lte: today,
        },
      },
    });

    if (invite) return invite;

    return this.prisma.channelInvite.create({
      data: {
        userId: user.userId,
        channelId: id,
        days,
        code: urlNanoid(12),
        expireAt: dayjs().add(days, 'day').toDate(),
      },
    });
  }
}
