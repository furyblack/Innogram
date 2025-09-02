import { Module } from "@nestjs/common";
import { UsersController } from "./api/users.controller";
import { UsersService } from "./application/users.service";
import { UsersRepository } from "./infrastructure/users.repository";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: []
})

export class UsersModule {}