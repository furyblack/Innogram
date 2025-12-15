import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './domain/asset.entity';
import { AssetsController } from './api/assets.controller';
import { AssetsService } from './application/assets.service';
import { AssetsRepository } from './infrastructure/assets.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), ConfigModule],
  controllers: [AssetsController],
  providers: [AssetsService, AssetsRepository],
  exports: [AssetsRepository],
})
export class AssetsModule {}
