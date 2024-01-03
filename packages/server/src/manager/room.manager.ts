import { Injectable, Logger } from '@nestjs/common';
import { ChannelRolePermissionCode, PrismaClient } from '@prisma/client';
import { ChannelCreateInput } from 'src/@generated';
import { TxManager } from './tx.manager';
import { intersection } from 'lodash';

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
                channelRole: {
                  create: {
                    name: '管理员',
                    channelId: channel.id,
                    color: '#6cbf00',
                    permissions: {
                      connect: { code: ChannelRolePermissionCode.ADMIN },
                    },
                  },
                },
              },
            ],
          },
          roles: {
            create: [
              {
                name: '成员',
                defaultRole: true,
                permissions: {
                  connect: [
                    { code: ChannelRolePermissionCode.INVITE },
                    { code: ChannelRolePermissionCode.SEND_CHAT },
                    { code: ChannelRolePermissionCode.VOICE },
                  ],
                },
              },
            ],
          },
        },
        where: {
          id: channel.id,
        },
      });
    });
  }

  async checkChannelPerimissions(
    userId: bigint | number | null | undefined,
    channelId: bigint | number,
    permissionCodes: ChannelRolePermissionCode | ChannelRolePermissionCode[],
  ) {
    if (!userId || !channelId) return false;

    const codes = (Array.isArray(permissionCodes) ? permissionCodes : [permissionCodes]).concat([
      ChannelRolePermissionCode.ADMIN,
    ]);

    const channelUser = await this.prisma.channelToUser.findUnique({
      where: {
        userId_channelId: {
          channelId,
          userId,
        },
      },
      select: {
        channelRole: {
          select: {
            permissions: true,
          },
        },
      },
    });

    return (
      intersection(
        codes,
        channelUser.channelRole.permissions.map((it) => it.code),
      ).length > 0
    );
  }

  async checkRoomPermissions(
    userId: bigint | number | null | undefined,
    roomId: bigint | number,
    permissionCodes: ChannelRolePermissionCode | ChannelRolePermissionCode[],
  ) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        id: true,
        channelId: true,
      },
    });

    if (!room) return false;

    return this.checkChannelPerimissions(userId, room.channelId, permissionCodes);
  }
}
