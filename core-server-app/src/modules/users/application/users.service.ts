import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { User } from '../domain/user.entity';
// import { CreateUserDto } from '../dto/create-user-dto'; // <-- Удалено
// import { UpdateUserDto } from '../dto/update-user-dto'; // <-- TODO: Переделать
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  // (createUser) - удален

  async getUsers(paginationDto: PaginationDto): Promise<User[]> {
    return this.usersRepo.findAll(paginationDto);
  }

  async getUserById(id: string): Promise<User> {
    // <-- ТИП ИЗМЕНЕН
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // (updateUser) - TODO: переделать DTO, он не должен обновлять email/username

  async deleteUser(id: string): Promise<void> {
    // <-- ТИП ИЗМЕНЕН
    const deleted = await this.usersRepo.deleteUser(id);
    if (!deleted) throw new NotFoundException('User not found');
  }
}
