import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SYSTEM_USERNAME } from './consts';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaClient) {}

  async onApplicationBootstrap() {
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
  }
}
