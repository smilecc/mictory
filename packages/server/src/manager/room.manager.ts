import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ChannelCreateInput } from 'src/@generated';
import { TxManager } from './tx.manager';

@Injectable()
export class RoomManager {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly txManager: TxManager,
  ) {}

  private readonly logger = new Logger(RoomManager.name);

  async createChannel(userId: bigint | number, data: Omit<ChannelCreateInput, 'ownerUser'>) {
    this.logger.log(`createChannel -> userId: ${userId}, ${JSON.stringify(data)}`);

    return this.txManager.run(async (tx) => {
      // 创建频道
      const channel = await tx.channel.create({
        data: {
          ...data,
          ownerUser: {
            connect: {
              id: userId,
            },
          },
        },
      });

      // 创建默认角色和初始用户
      return tx.channel.update({
        data: {
          categories: {
            create: {
              name: 'General',
              rooms: {
                create: {
                  name: '默认房间',
                  channelId: channel.id,
                },
              },
            },
          },
          users: {
            create: [
              {
                user: { connect: { id: userId } },
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
}
