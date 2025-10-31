import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { CoreAuthService } from './auth.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AuthController],
  providers: [CoreAuthService],
})
export class AuthModule {}
