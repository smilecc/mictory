import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Info, Mutation, Context, Directive } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { Channel } from 'src/@generated/channel/channel.model';
import { CreateOneChannelArgs } from 'src/@generated/channel/create-one-channel.args';
import { FindManyChannelArgs } from 'src/@generated/channel/find-many-channel.args';
import { UpdateOneChannelArgs } from 'src/@generated/channel/update-one-channel.args';
import { ChannelJoinInput } from 'src/graphql/types/channel-join.input';
import { JwtUserClaims } from 'src/types';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly prisma: PrismaClient) {}

  private readonly logger = new Logger(ChannelResolver.name);

  @Query(() => [Channel], { nullable: 'items' })
  async channels(@Args() args: FindManyChannelArgs, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return this.prisma.channel.findMany({ ...args, ...select });
  }

  @Directive('@auth')
  @Mutation(() => Channel)
  async channelCreate(
    @Context('user') user: JwtUserClaims,
    @Args() args: CreateOneChannelArgs,
    @Info() info: GraphQLResolveInfo,
  ) {
    this.logger.log(`ChannelCreate, User: ${user.userId} Channel: ${JSON.stringify(args)}`);
    const select = new PrismaSelect(info).value;
    return this.prisma.$transaction(async (tx) => {
      // 创建频道
      const channel = await tx.channel.create({
        data: {
          ...args.data,
          ownerUser: {
            connect: {
              id: user.userId,
            },
          },
        },
      });

      // 创建默认角色和初始用户
      return tx.channel.update({
        ...select,
        data: {
          categories: {
            create: {
              name: 'General',
              rooms: {
                create: {
                  name: '默认房间',
                },
              },
            },
          },
          users: {
            create: [
              {
                user: { connect: { id: user.userId } },
                // 创建者作为管理员
                channelRole: { create: { name: '管理员', channelId: channel.id } },
              },
            ],
          },
          roles: {
            create: [{ name: '成员', defaultRole: true }],
          },
        },
        where: {
          id: channel.id,
        },
      });
    });
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
    const select = new PrismaSelect(info).value;
    const defaultRole = await this.prisma.channelRole.findFirst({
      where: {
        channelId: args.channelId,
        defaultRole: true,
      },
    });

    return this.prisma.channel.update({
      ...select,
      where: {
        id: args.channelId,
      },
      data: {
        users: {
          connectOrCreate: {
            where: {
              userId_channelId: {
                userId: user.userId,
                channelId: args.channelId,
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
