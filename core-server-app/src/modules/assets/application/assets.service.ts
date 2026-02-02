import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { S3Service } from './s3.service';

@Injectable()
export class AssetsService {
  constructor(
    private readonly s3Service: S3Service,
    @Inject('NOTIFY_SERVICE') private readonly client: ClientProxy,
  ) {}

  async saveFileToS3(file: Express.Multer.File) {
    // 1. Загружаем в облако (как и раньше)
    const url = await this.s3Service.uploadFile(file);

    // 2. ОТПРАВЛЯЕМ СОБЫТИЕ В RABBITMQ 🐰🚀
    // Мы не ждем ответа (emit), просто кидаем сообщение
    this.client.emit('avatar_uploaded', {
      url,
      fileName: file.originalname,
      size: file.size,
      uploadedAt: new Date(),
    });

    console.log('📬 Message sent to RabbitMQ: avatar_uploaded');

    return {
      url,
      name: file.originalname,
      size: file.size,
    };
  }
}
