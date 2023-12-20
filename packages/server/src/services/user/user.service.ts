import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { createHmac } from 'crypto';
import { User, UserCreateInput } from 'src/@generated';
import { RoomManager } from 'src/manager';
import { ChatManager } from 'src/manager/chat.manager';
import { TxManager } from 'src/manager/tx.manager';
import { JwtUserClaims, RequestUserType } from 'src/modules/auth.module';
import { TableId } from 'src/types';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
    private readonly txManager: TxManager,
    private readonly roomManager: RoomManager,
    private readonly chatManager: ChatManager,
  ) {}

  private readonly logger = new Logger(UserService.name);

  /**
   * 生成密码哈希
   * @param password 密码原文
   * @param passwordSalt 密码盐
   * @returns
   */
  generatePasswordHash(password: string, passwordSalt: string): string {
    return createHmac('sha256', global.appSecret).update(`${password}${passwordSalt}`).digest('hex');
  }

  generateSessionToken(user: User): Promise<string> {
    const claims: JwtUserClaims = {
      userId: user.id,
      type: RequestUserType.USER,
    };

    return this.jwtService.signAsync(claims);
  }

  async createUser(user: UserCreateInput): Promise<User> {
    this.logger.log(`CreateUser, User: ${JSON.stringify(user)}`);
    // 写入用户表
    const nickname = user.nickname.trim();
    return this.txManager.run(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          ...user,
          nickname,
          nicknameNo: 0,
        },
      });

      // 创建用户默认频道
      await this.roomManager.createChannel(newUser.id, {
        name: `${newUser.nickname}的频道`,
      });

      // 发送系统消息
      await this.chatManager.sendSystem({
        target: 'USER',
        targetUser: {
          connect: { id: newUser.id },
        },
        message: [{ type: 'p', children: [{ text: 'Welcome!🥳🥳🥳' }] }],
      });

      return this.setUserNickname(newUser.id, nickname);
    });
  }

  async setUserNickname(userId: TableId, newNickname: string, force: boolean = false) {
    const nickname = newNickname.trim();
    return this.txManager.run(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: BigInt(userId),
        },
      });

      if (!force && user.nickname === nickname) {
        return user;
      }

      // 锁定用户昵称编号
      const userNickname = await tx.userNickname.upsert({
        where: {
          nickname,
        },
        update: {
          no: { increment: 1 },
        },
        create: {
          nickname,
          no: 1000,
        },
      });

      return tx.user.update({
        where: {
          id: BigInt(userId),
        },
        data: {
          nickname,
          nicknameNo: userNickname.no,
        },
      });
    });
  }
}
