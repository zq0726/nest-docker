import { Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  deleteFile(name: string) {
    const isProd = process.env.NODE_ENV === 'production';
    const basePath = isProd
      ? '/app/uploads'
      : join(process.cwd(), 'src/assets/upload');
    unlinkSync(join(basePath, name));
  }
}
