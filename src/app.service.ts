import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from './cache/cache.service';

@Injectable()
export class AppService {
  constructor(@Inject() private cacheService: CacheService) {}
  getHello(): string {
    return '  Hello World! && cg  mysql';
  }

  setCache(key: string, value: unknown, second: number = 1000): any {
    console.log(key, value, second);
    return this.cacheService.set(key, value, second);
  }

  getCache(key: string): any {
    return this.cacheService.get(key);
  }
}
