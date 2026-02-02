import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './domain/asset.entity';
import { AssetsController } from './api/assets.controller';
import { AssetsService } from './application/assets.service';
import { AssetsRepository } from './infrastructure/assets.repository';
import { ConfigModule } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import { S3Service } from './application/s3.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
    ConfigModule,
    ClientsModule.register([
      {
        name: 'NOTIFY_SERVICE', // Уникальное имя для инъекции
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@127.0.0.1:5672'], // Твои креды из .env
          queue: 'file_events_queue', // Название очереди
          queueOptions: {
            durable: false, // Очередь удалится при перезапуске Кролика (для разработки ок)
          },
        },
      },
    ]),
  ],
  controllers: [AssetsController],
  providers: [AssetsService, AssetsRepository, S3Service],
  exports: [AssetsRepository],
})
export class AssetsModule {}
