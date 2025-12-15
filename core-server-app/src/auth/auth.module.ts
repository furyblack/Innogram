import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { CoreAuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/modules/users/user.module';

@Module({
  imports: [HttpModule, ConfigModule, PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [CoreAuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
