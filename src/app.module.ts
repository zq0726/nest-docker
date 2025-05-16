import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { cwd } from 'process';
import { UserModule } from './modules/user/user.module';
import { CacheModule } from './cache/cache.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
