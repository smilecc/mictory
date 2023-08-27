/**
 * 获取环境变量
 * @param name 环境变量名
 * @param defaultValue 默认值
 * @returns
 */
export function env(name: string, defaultValue: string | undefined = undefined): string {
  return process.env[name] || defaultValue;
}
