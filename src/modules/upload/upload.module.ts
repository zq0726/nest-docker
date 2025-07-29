import { Global, Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadService } from './upload.service';

// const isProd = process.env.NODE_ENV == 'production';

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination:
          process.env.UPLOAD_PATH || join(process.cwd(), 'src/assets/upload'),

        // destination: isProd
        //   ? '/app/uploads'
        //   : join(process.cwd(), 'src/assets/upload'),
        filename: (req, file, cb) => {
          console.log('file', file);
          const uniqueName = `${new Date().getTime()}${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `${uniqueName}${ext}`);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
