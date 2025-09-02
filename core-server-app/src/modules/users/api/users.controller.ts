import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import * as usersService from '../application/users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: usersService.UsersService) {}

  @Post()
  create(@Body() body: { username: string; email: string; password: string }): usersService.User {
    return this.usersService.createUser(body.username, body.email, body.password);
  }

  @Get()
  findAll(): usersService.User[] {
    
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): usersService.User {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ username: string; email: string; password: string }>
  ): usersService.User {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.usersService.removeUser(id);
    return { message: 'User deleted' };
  }
}
