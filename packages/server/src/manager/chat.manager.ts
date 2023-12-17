import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TxManager } from './tx.manager';
import { ChatCreateInput } from 'src/@generated';
import { SYSTEM_USERNAME } from 'src/consts';

@Injectable()
export class ChatManager {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly txManager: TxManager,
  ) {}

  private readonly logger = new Logger(ChatManager.name);

  async send(msg: ChatCreateInput) {
    return this.txManager.run(async (tx) => {
      const message = await tx.chat.create({
        data: {
          ...msg,
        },
      });

      if (message.target === 'USER') {
        const userAId = message.userId < message.targetUserId ? message.userId : message.targetUserId;
        const userBId = message.userId < message.targetUserId ? message.targetUserId : message.userId;

        // 创建好友关系
        await tx.userFriend.upsert({
          where: {
            userAId_userBId: {
              userAId,
              userBId,
            },
          },
          create: {
            userAId,
            userBId,
            ...(message.type === 'SYSTEM'
              ? {
                  userAAccept: true,
                  userBAccept: true,
                }
              : {}),
          },
          update: {
            lastChatTime: new Date(),
          },
        });
      }

      return message;
    });
  }

  async sendSystem(msg: Pick<ChatCreateInput, 'message' | 'target' | 'room' | 'targetUser'>) {
    return this.send({
      ...msg,
      type: 'SYSTEM',
      user: {
        connect: { username: SYSTEM_USERNAME },
      },
    });
  }
}
