import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../domain/account.entity';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
  ) {}

  async findById(id: string): Promise<Account | null> {
    return this.repo.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.repo.findOne({
      where: { email },
      relations: ['user'],
    });
  }
}
