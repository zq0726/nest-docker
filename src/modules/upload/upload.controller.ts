import { Public } from '@/common/decorator/public/public.decorator';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Public()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return { path: file.filename };
  }

  @Delete(':name')
  deleteFile(@Param() name: string) {
    return this.uploadService.deleteFile(name);
  }
}
