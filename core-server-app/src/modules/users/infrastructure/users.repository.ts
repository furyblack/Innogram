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
      // 1. Убираем жесткий select, либо добавляем туда 'email'
      // Если убрать select, вернется всё (кроме полей с @Exclude, типа password)
      // select: ['id', 'email', 'role', 'disabled', 'createdAt'],

      // 2. САМОЕ ГЛАВНОЕ: Грузим профиль!
      relations: ['profile'],

      skip: skip,
      take: limit,
      order: { createdAt: 'DESC' },
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
