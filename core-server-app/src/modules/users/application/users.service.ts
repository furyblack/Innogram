import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { User } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user-dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const password_hash = await bcrypt.hash(dto.password, 10);
    return this.usersRepo.createUser({
      username: dto.username,
      email: dto.email,
      phone_number: dto.phone_number,
      password_hash,
    });
  }

  async getUsers(paginationDto: PaginationDto): Promise<User[]> {
    return this.usersRepo.findAll(paginationDto);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    let password_hash: string | undefined;

    if (dto.password) {
      password_hash = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.usersRepo.updateUser(id, {
      ...dto,
      ...(password_hash ? { password_hash } : {}),
    });

    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async deleteUser(id: number): Promise<void> {
    const deleted = await this.usersRepo.deleteUser(id);
    if (!deleted) throw new NotFoundException('User not found');
  }
}
