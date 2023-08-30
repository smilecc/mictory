import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHmac } from 'crypto';
import { User } from 'src/@generated/user/user.model';
import { JwtUserClaims } from 'src/types';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

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
    return this.jwtService.signAsync({ userId: user.id.toString() } as JwtUserClaims);
  }
}
