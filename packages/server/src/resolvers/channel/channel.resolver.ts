import { UserInputError } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Info, Mutation, Context, Directive } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { Channel, CreateOneChannelArgs, FindManyChannelArgs, UpdateOneChannelArgs } from 'src/@generated';
import { ChannelJoinInput } from 'src/graphql/types/channel-join.input';
import { RoomManager } from 'src/manager';
import { TxManager } from 'src/manager/tx.manager';
import { JwtUserClaims } from 'src/types';

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

  @Directive('@auth')
  @Mutation(() => Channel)
  async channelCreate(@Context('user') user: JwtUserClaims, @Args() args: CreateOneChannelArgs) {
    return this.roomManager.createChannel(user.userId, args.data);
  }

  @Mutation(() => Channel)
  async channelUpdate(
    @Context('user') user: JwtUserClaims,
    @Args() args: UpdateOneChannelArgs,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = new PrismaSelect(info).value;
    // TODO 判断用户是否有权限更新
    const channel = await this.prisma.channel.findFirst({ where: args.where });
    this.logger.log(`ChannelUpdate, User: ${user.userId} OldChannel: ${channel} Data: ${args.data}`);
    return this.prisma.channel.update({
      ...select,
      data: args.data,
      where: {
        id: channel.id,
      },
    });
  }

  @Mutation(() => Channel)
  async channelJoin(
    @Context('user') user: JwtUserClaims,
    @Args('data') args: ChannelJoinInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        code: args.code,
      },
    });

    if (!channel) {
      throw new UserInputError('加入频道失败，频道不存在');
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
}
