import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../domain/profile.entity';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.repo.findOne({
      where: { userId },
    });
  }

  async findById(id: string): Promise<Profile | null> {
    return this.repo.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<Profile | null> {
    return this.repo.findOneBy({ username });
  }
}
