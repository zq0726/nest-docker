import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

interface RedisData {
  [key: string]: string | number | boolean | RedisData[] | RedisData | null;
}

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private redisClient: RedisClientType) {}

  /**
   * 获取缓存的值
   * @param { string } key: 缓存的键
   * @returns
   */
  async get(key: string): Promise<RedisData | null> {
    const rawValue = await this.redisClient.get(key);

    if (rawValue === null) return null;

    try {
      const parsedValue = JSON.parse(rawValue) as RedisData;
      return parsedValue;
    } catch (error) {
      console.error(
        '解析失败:',
        error instanceof Error ? error.message : '未知错误',
      );
      return null;
    }
  }

  /**
   * 设置值
   * @param { string } key
   * @param { any } value
   * @param { number | undefined } second
   * @returns
   */
  async set(key: string, value: any, second?: number) {
    value = JSON.stringify(value);
    return await this.redisClient.set(key, value, {
      expiration: {
        type: 'EX',
        value: second || 60 * 5, //默认五分钟
      },
    });
  }

  //删除值
  async del(key: string) {
    return await this.redisClient.del(key);
  }
  //清除缓存
  async clear() {
    return await this.redisClient.flushAll();
  }
}
