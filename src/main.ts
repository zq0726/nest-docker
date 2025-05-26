import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as pc from 'picocolors';
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter';
import { init } from './config/app.config';
import { TransformInterceptor } from './common/interceptor/transform/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(process.env.APP_PREFIX || '/api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  init(app);

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(pc.yellow(`\n 服务器运行在：http://localhost:${port} 上`));
}
bootstrap();
