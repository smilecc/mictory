import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SYSTEM_USERNAME } from './consts';
import { ChannelRolePermissionCode } from './@generated';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaClient) {}

  async onApplicationBootstrap() {
    // 初始化系统用户
    const systemCount = await this.prisma.user.count({
      where: {
        type: 'SYSTEM',
      },
    });

    if (systemCount <= 0) {
      const system = await this.prisma.user.create({
        data: {
          type: 'SYSTEM',
          username: SYSTEM_USERNAME,
          nickname: 'System',
          nicknameNo: 0,
          password: '',
          passwordSalt: '',
          sessionState: 'ONLINE',
        },
      });

      this.logger.log(`Create System User, Id: ${system.id}`);
    }

    // 初始化频道权限
    const permissionCodes = Object.keys(ChannelRolePermissionCode);
    await Promise.all(
      permissionCodes.map((code) =>
        this.prisma.channelRolePermission.upsert({
          where: {
            code: code as ChannelRolePermissionCode,
          },
          create: {
            code: code as ChannelRolePermissionCode,
          },
          update: {},
        }),
      ),
    );
  }
}
