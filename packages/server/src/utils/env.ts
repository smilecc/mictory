import * as process from 'process';

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
