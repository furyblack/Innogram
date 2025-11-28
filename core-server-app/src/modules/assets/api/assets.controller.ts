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
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('assets')
@UseGuards(AuthGuard('jwt')) // Загружать могут только свои
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Папка сохранения (в корне core-server-app)
        filename: (req, file, callback) => {
          // Генерация уникального имени
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.assetsService.saveFile(file);
  }
}
