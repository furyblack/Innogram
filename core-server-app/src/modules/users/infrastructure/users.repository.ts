import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // (create User) - удален, этим занимается auth-service

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return this.repo.find({
      select: ['id', 'role', 'disabled', 'created_at'], // <-- username и email УДАЛЕНЫ
      skip: skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<User | null> {
    // <-- ТИП ИЗМЕНЕН
    return await this.repo.findOneBy({ id });
  }

  // (findByEmail) - удален, переехал в AccountsRepository

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    // <-- ТИП ИЗМЕНЕН
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    // <-- ТИП ИЗМЕНЕН
    const result = await this.repo.delete(id);
    return !!result.affected;
  }
}
