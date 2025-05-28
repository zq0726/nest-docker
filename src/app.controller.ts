import {
  Controller,
  Get,
  // HttpException,
  // HttpStatus,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorator/public/public.decorator';
// import { ApiException } from './common/filter/http-exception/api.exception';
// import { ApiErrorCode } from './common/enums/api-error-code.enum';

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // throw new ApiException('用户id无效', ApiErrorCode.USER_NOT_EXIST);
    // throw new HttpException('您有问题', HttpStatus.FORBIDDEN);
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
