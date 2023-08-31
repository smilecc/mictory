import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { createHmac } from 'crypto';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { User } from 'src/@generated/user/user.model';
import { JwtUserClaims } from 'src/types';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
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
    return this.jwtService.signAsync({ userId: parseInt(user.id.toString()) } as JwtUserClaims);
  }

  async createUser(user: UserCreateInput): Promise<User> {
    this.logger.log(`CreateUser, User: ${JSON.stringify(user)}`);
    // 写入用户表
    const nickname = user.nickname.trim();
    return this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          ...user,
          nickname,
          nicknameNo: 0,
        },
      });

      // 锁定用户昵称编号
      const userNickname = await tx.userNickname.upsert({
        where: {
          nickname: newUser.nickname.trim(),
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
        data: {
          nicknameNo: userNickname.no,
        },
        where: {
          id: newUser.id,
        },
      });
    });
  }
}
