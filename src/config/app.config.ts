import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// 初始配置
export const init = (app) => {
  const address = process.env.SWAGGER_ADDRESS || '/docs/api';
  // 配置 swagger
  const options = new DocumentBuilder()
    .setTitle('后台管理')
    .setDescription('后台管理系统文档')
    .setVersion('1.0')
    // .addBearerAuth() //是否需要token
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(address, app, document);
};
