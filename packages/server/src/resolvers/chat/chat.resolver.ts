import { Logger } from '@nestjs/common';
import { Args, Context, Directive, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { Chat, CreateOneChatArgs, DeleteManyChatArgs, FindManyChatArgs } from 'src/@generated';
import { JwtUserClaims } from 'src/types';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly prisma: PrismaClient) {}

  private readonly logger = new Logger(ChatResolver.name);

  @Query(() => [Chat], { description: '查询消息' })
  async chats(@Args() args: FindManyChatArgs) {
    return this.prisma.chat.findMany(args);
  }

  @Directive('@auth')
  @Mutation(() => Chat, { description: '创建聊天消息' })
  async createChatMessage(@Context('user') user: JwtUserClaims, @Args() args: CreateOneChatArgs) {
    this.logger.log(`创建聊天消息, ${JSON.stringify(args)}`);

    return this.prisma.chat.create({
      data: {
        ...args.data,
        user: {
          connect: { id: user.userId },
        },
      },
    });
  }

  @Directive('@auth')
  @Mutation(() => Chat, { description: '删除聊天消息' })
  async deleteChatMessage(@Context('user') user: JwtUserClaims, @Args() args: DeleteManyChatArgs) {
    this.logger.log(`删除聊天消息, ${JSON.stringify(args)}`);

    return this.prisma.chat.deleteMany({
      where: {
        ...(args.where || {}),
        userId: user.userId,
      },
    });
  }
}
