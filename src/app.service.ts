import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from './cache/cache.service';

@Injectable()
export class AppService {
  constructor(@Inject() private cacheService: CacheService) {}
  getHello(): string {
    return '  Hello World! && cg  mysql  gg  66';
  }

  setCache(key: string, value: unknown, second: number = 1000): any {
    return this.cacheService.set(key, value, second);
  }

  getCache(key: string): any {
    return this.cacheService.get(key);
  }
}
