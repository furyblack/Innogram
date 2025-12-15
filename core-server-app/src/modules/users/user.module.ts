import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { User } from './domain/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './api/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], // <-- ProfileController удален
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository], // Оставляем
})
export class UsersModule {}
