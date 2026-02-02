import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AssetsService } from '../application/assets.service';
import { memoryStorage } from 'multer';
import { extname } from 'path';

@Controller('assets')
@UseGuards(AuthGuard('jwt'))
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // 👈 Файл теперь не пишется на диск, а лежит в буфере
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Передаем файл в сервис, который отправит его в S3 (MinIO)
    return this.assetsService.saveFileToS3(file);
  }
}
