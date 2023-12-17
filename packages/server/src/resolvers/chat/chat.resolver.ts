import { Logger } from '@nestjs/common';
import { Args, Context, Directive, Mutation, Resolver, Query, Info } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { Chat, CreateOneChatArgs, DeleteManyChatArgs, FindManyChatArgs } from 'src/@generated';
import { CTX_USER } from 'src/consts';
import { ChatManager } from 'src/manager/chat.manager';
import { TxManager } from 'src/manager/tx.manager';
import { RequestUser } from 'src/modules/auth.module';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly txManager: TxManager,
    private readonly chatManager: ChatManager,
  ) {}

  private readonly logger = new Logger(ChatResolver.name);

  @Query(() => [Chat], { description: '查询消息' })
  async chats(@Args() args: FindManyChatArgs, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;

    return this.prisma.chat.findMany({ ...args, ...select });
  }

  @Directive('@user')
  @Mutation(() => Chat, { description: '创建聊天消息' })
  async createChatMessage(@Context(CTX_USER) user: RequestUser, @Args() args: CreateOneChatArgs) {
    this.logger.log(`创建聊天消息, ${JSON.stringify(args)}`);

    return this.chatManager.send({
      ...args.data,
      type: 'USER',
      user: {
        connect: { id: user.userId },
      },
    });
  }

  @Directive('@user')
  @Mutation(() => Chat, { description: '删除聊天消息' })
  async deleteChatMessage(@Context(CTX_USER) user: RequestUser, @Args() args: DeleteManyChatArgs) {
    this.logger.log(`删除聊天消息, ${JSON.stringify(args)}`);

    return this.prisma.chat.deleteMany({
      where: {
        ...(args.where || {}),
        userId: user.userId,
      },
    });
  }
}
