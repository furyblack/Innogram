import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './domain/account.entity';
import { AccountsRepository } from './infrastructure/accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountsRepository],
  exports: [AccountsRepository],
})
export class AccountsModule {}
