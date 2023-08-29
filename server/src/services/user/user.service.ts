import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class UserService {
  /**
   * 生成密码哈希
   * @param password 密码原文
   * @param passwordSalt 密码盐
   * @returns
   */
  generatePasswordHash(password: string, passwordSalt: string): string {
    return createHmac('sha256', global.appSecret).update(`${password}${passwordSalt}`).digest('hex');
  }
}
