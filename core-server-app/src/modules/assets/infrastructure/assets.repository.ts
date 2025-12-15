import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../domain/asset.entity';

@Injectable()
export class AssetsRepository {
  constructor(
    @InjectRepository(Asset)
    private readonly repo: Repository<Asset>,
  ) {}

  async createAsset(fileData: Partial<Asset>): Promise<Asset> {
    const asset = this.repo.create(fileData);
    return this.repo.save(asset);
  }

  async findById(id: string): Promise<Asset | null> {
    return this.repo.findOneBy({ id });
  }
}
