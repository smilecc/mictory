import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from './logger.module';
import { PrismaClient } from '@prisma/client';
import { loadOrGenerateAppSecret } from 'src/utils';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: loadOrGenerateAppSecret(),
      signOptions: { expiresIn: '365d' },
    }),
    LoggerModule,
  ],
  exports: [],
})
export class AuthModule {}

export enum RequestUserType {
  USER = 'User',
  ADMIN = 'Admin',
}

export interface JwtUserClaims {
  userId: bigint;
  type: RequestUserType;
}

export class RequestUser {
  constructor(
    private readonly jwtUser: JwtUserClaims | null,
    private readonly prisma: PrismaClient,
  ) {}

  get isVisitor(): boolean {
    return this.jwtUser === null;
  }

  get isUser(): boolean {
    return this.jwtUser.type === RequestUserType.USER;
  }

  get isAdmin(): boolean {
    return this.jwtUser.type === RequestUserType.ADMIN;
  }

  get userId(): null | bigint {
    if (this.isVisitor || !this.isUser) {
      return null;
    }

    return this.jwtUser.userId;
  }

  get adminId(): null | bigint {
    if (this.isVisitor || !this.isAdmin) {
      return null;
    }

    return this.jwtUser.userId;
  }
}
