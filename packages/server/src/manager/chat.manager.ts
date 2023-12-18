import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TxManager } from './tx.manager';
import { ChatCreateInput } from 'src/@generated';
import { SYSTEM_USERNAME } from 'src/consts';
import { socketRoomKey, socketUserKey } from 'src/utils';
import { SocketIoManager } from './socket-io.manager';
import { NewChatMessageEvent } from '@mictory/common';

@Injectable()
export class ChatManager {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly txManager: TxManager,
    private readonly socketIoManager: SocketIoManager,
  ) {}

  private readonly logger = new Logger(ChatManager.name);

  async send(msg: ChatCreateInput) {
    return this.txManager.run(async (tx) => {
      const message = await tx.chat.create({
        data: {
          ...msg,
        },
        include: {
          user: true,
        },
      });

      if (message.target === 'USER') {
        const userAId = message.userId < message.targetUserId ? message.userId : message.targetUserId;
        const userBId = message.userId < message.targetUserId ? message.targetUserId : message.userId;

        await Promise.all([
          // 更新未读消息
          tx.user.update({
            where: { id: message.targetUserId },
            data: {
              unreadMessage: {
                increment: 1,
              },
            },
          }),

          // 创建好友关系
          tx.userFriend.upsert({
            where: {
              userAId_userBId: {
                userAId,
                userBId,
              },
            },
            create: {
              userAId,
              userBId,
              ...(userAId === message.targetUserId
                ? {
                    userAUnread: 1,
                  }
                : {
                    userBUnread: 1,
                  }),
              ...(message.type === 'SYSTEM'
                ? {
                    userAAccept: true,
                    userBAccept: true,
                  }
                : {}),
            },
            update: {
              lastChatTime: new Date(),
              ...(userAId === message.targetUserId
                ? {
                    userAUnread: {
                      increment: 1,
                    },
                  }
                : {
                    userBUnread: {
                      increment: 1,
                    },
                  }),
            },
          }),
        ]);

        // 通知客户端
        console.log(socketUserKey(message.targetUserId));
        this.socketIoManager.socket.to(socketUserKey(message.targetUserId)).emit('newChatMessage', {
          target: 'USER',
          toUserId: message.targetUserId,
          text: message.plainText,
          fromUser: {
            id: message.userId,
            nickname: message.user.nickname,
            nicknameNo: message.user.nicknameNo,
          },
        } as NewChatMessageEvent);
      } else if (message.target === 'ROOM') {
        // 通知客户端
        this.socketIoManager.socket.to(socketRoomKey(message.roomId)).emit('newChatMessage', {
          target: 'ROOM',
          toRoomId: message.roomId,
          text: message.plainText,
          fromUser: {
            id: message.userId,
            nickname: message.user.nickname,
            nicknameNo: message.user.nicknameNo,
          },
        } as NewChatMessageEvent);
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
