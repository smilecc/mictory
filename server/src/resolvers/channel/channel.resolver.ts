import { Resolver, Query, Args, Info, Mutation, Context, Directive } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { Channel } from 'src/@generated/channel/channel.model';
import { CreateOneChannelArgs } from 'src/@generated/channel/create-one-channel.args';
import { FindManyChannelArgs } from 'src/@generated/channel/find-many-channel.args';
import { UpdateOneChannelArgs } from 'src/@generated/channel/update-one-channel.args';
import { JwtUserClaims } from 'src/types';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly prisma: PrismaClient) {}

  @Query(() => [Channel], { nullable: 'items' })
  async channels(@Args() args: FindManyChannelArgs, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return this.prisma.channel.findMany({ ...args, ...select });
  }

  @Directive('@auth')
  @Mutation(() => Channel)
  async channelCreate(@Context('user') user: JwtUserClaims, @Args() args: CreateOneChannelArgs) {
    return this.prisma.channel.create({
      data: {
        ...args.data,
        ownerUser: {
          connect: {
            id: user.userId,
          },
        },
        users: {
          connect: [{ id: user.userId }],
        },
        rooms: {
          create: {
            name: '默认房间',
          },
        },
      },
    });
  }

  @Mutation(() => Channel)
  async channelUpdate(@Args() args: UpdateOneChannelArgs) {
    return this.prisma.channel.update({
      data: args.data,
      where: {
        ...args.where,
        ownerUserId: 0,
      },
    });
  }
}
