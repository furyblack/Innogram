import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { CoreAuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AuthController],
  providers: [CoreAuthService, GoogleStrategy],
})
export class AuthModule {}
