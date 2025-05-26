import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { cwd } from 'process';
import { UserModule } from './modules/user/user.module';
import { CacheModule } from './cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

const isProd = process.env.NODE_ENV == 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        isProd ? path.join(cwd(), '.env.prod') : path.join(cwd(), '.env'),
      ],
      isGlobal: true,
    }),
    UserModule,
    CacheModule,
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'), // 端口号
          username: configService.get('DB_USER'), // 用户名
          password: configService.get('DB_PASSWD'), // 密码
          database: configService.get('DB_DATABASE'), //数据库名
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // synchronize: !isProd, // 生产环境不自动同步
          connectorPackage: 'mysql2', //驱动包
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXP'),
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
