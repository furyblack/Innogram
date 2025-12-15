import { Injectable } from '@nestjs/common';
import { AssetsRepository } from '../infrastructure/assets.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AssetsService {
  constructor(
    private readonly assetsRepo: AssetsRepository,
    private readonly configService: ConfigService,
  ) {}

  async saveFile(file: Express.Multer.File) {
    // Генерируем публичный URL
    // Например: http://localhost:3001/uploads/filename.jpg
    const appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:3001';
    const publicUrl = `${appUrl}/uploads/${file.filename}`;

    const newAsset = await this.assetsRepo.createAsset({
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: publicUrl, // Сохраняем сразу готовую ссылку
    });

    return {
      ...newAsset,
      url: publicUrl,
    };
  }
}
