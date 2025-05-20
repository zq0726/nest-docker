import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as pc from 'picocolors';
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  const options = new DocumentBuilder()
    .setTitle('后台管理')
    .setDescription('后台管理系统文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs/api', app, document);

  const port = process.env.APP_PORT || 3000;

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
  console.log(pc.yellow(`\n 服务器运行在：http://localhost:${port} 上`));
}
bootstrap();
