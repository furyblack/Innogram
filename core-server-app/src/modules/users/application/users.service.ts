import { Injectable, NotFoundException } from '@nestjs/common';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private users: User[] = []; // пока временно хранение в памяти

  // Создание нового пользователя
  createUser(username: string, email: string, password: string): User {
    const newUser: User = {
      id: (Math.random() * 1000000).toFixed(0),
      username,
      email,
      password, // позже будем хешировать
    };
    this.users.push(newUser);
    return newUser;
  }

  // Получить всех пользователей
  findAll(): User[] {
    return this.users;
  }

  // Найти пользователя по id
  findById(id: string): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Обновить пользователя
  updateUser(id: string, data: Partial<User>): User {
    const user = this.findById(id);
    Object.assign(user, data);
    return user;
  }

  // Удалить пользователя
  removeUser(id: string): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }
}
