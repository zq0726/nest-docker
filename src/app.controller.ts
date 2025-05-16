import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/setCache')
  setCache(
    @Query('key') key: string,
    @Query('value') value: unknown,
    @Query('second') second?: number,
  ): unknown {
    return this.appService.setCache(key, value, second);
  }

  @Get('/getCache')
  getCache(@Query('key') key: string) {
    return this.appService.getCache(key);
  }
}
