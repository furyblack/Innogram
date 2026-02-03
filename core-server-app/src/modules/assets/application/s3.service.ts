import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3Client: S3Client;
  private bucketName = 'innogram-assets';

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      // Используем 127.0.0.1, так как запускаем бэк локально, а MinIO в докере
      endpoint: 'http://127.0.0.1:9000',
      forcePathStyle: true, // Критично для MinIO
      credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
      },
    });
  }

  async onModuleInit() {
    const bucketName = 'innogram-assets';

    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch {
      await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    }

    // Делаем бакет публичным на чтение через код!
    const readOnlyPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*', // Разрешить всем
          Action: ['s3:GetObject'], // Только скачивание/просмотр
          Resource: [`arn:aws:s3:::${bucketName}/*`], // Все файлы внутри бакета
        },
      ],
    };

    try {
      await this.s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: bucketName,
          Policy: JSON.stringify(readOnlyPolicy),
        }),
      );
      console.log(`🔓 MinIO: Bucket "${bucketName}" is now PUBLIC (ReadOnly)`);
    } catch (err) {
      console.error('❌ Failed to set bucket policy:', err.message);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileKey = `${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer, // Берем данные из памяти
        ContentType: file.mimetype,
      }),
    );

    // Возвращаем публичную ссылку на файл
    return `http://127.0.0.1:9000/${this.bucketName}/${fileKey}`;
  }
}
