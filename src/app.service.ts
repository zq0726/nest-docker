import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return ' 真的有点问题啊 Hello World! hello qing';
  }
}
