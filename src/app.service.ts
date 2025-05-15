import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '  Hello World! hello qing  这次能行 66';
  }
}
