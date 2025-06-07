import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as pc from 'picocolors';
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter';
import { init } from './config/app.config';
import { TransformInterceptor } from './common/interceptor/transform/transform.interceptor';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as ip from 'ip';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 启用类型转换
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true, // 可选：过滤未定义的属性
    }),
  );
  app.setGlobalPrefix(process.env.APP_PREFIX || '/api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useStaticAssets(join(process.cwd(), 'src/assets'), {
    prefix: '/static/',
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  init(app);

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(
    pc.yellow(
      `\n 服务器运行在：http://${ip.address()}:${port}${process.env.APP_PREFIX} 上`,
    ),
  );
}
bootstrap();
