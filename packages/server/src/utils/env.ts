import * as process from 'process';
import { Logger } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { nanoid } from 'nanoid';

/**
 * 获取环境变量
 * @param name 环境变量名
 * @param defaultValue 默认值
 * @returns
 */
export function env(name: string, defaultValue: string | undefined = undefined): string {
  return process.env[name] || defaultValue;
}

export type AppEnv = 'prod' | 'dev';

export function appEnv() {
  return env('APP_ENV', 'prod') as AppEnv;
}

/**
 * 加载或生成一个应用秘钥
 */
export function loadOrGenerateAppSecret(): string {
  const secretPath = env('APP_SECRET_PATH', '.secret');
  if (!existsSync(secretPath)) {
    global.appSecret = nanoid(64);
    writeFileSync(secretPath, global.appSecret);
  } else {
    global.appSecret = readFileSync(secretPath).toString();
  }

  Logger.log(`AppSecret: ${global.appSecret}`, 'utils');

  return global.appSecret;
}
