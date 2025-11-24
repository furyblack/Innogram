import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_ACCESS_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_ACCESS_SECRET is not defined in .env file');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // 1. Проверяем заголовок Authorization
          const authHeader = request.headers.authorization;
          if (authHeader && authHeader.startsWith('Bearer ')) {
            console.log('🔍 [JwtStrategy] Found token in HEADER'); // 🔥 ЛОГ 1
            return authHeader.split(' ')[1];
          }

          // 2. Проверяем Куки
          const tokenFromCookie = request?.cookies?.access_token;
          if (tokenFromCookie) {
            console.log('🍪 [JwtStrategy] Found token in COOKIE'); // 🔥 ЛОГ 2
            return tokenFromCookie;
          }

          console.log('❌ [JwtStrategy] Token NOT FOUND in Header or Cookie'); // 🔥 ЛОГ 3
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    console.log('🔓 [JwtStrategy] Validate payload:', payload); // 🔥 ЛОГ 4 (Если ты видишь это, значит токен валиден и расшифрован!)

    if (!payload || !payload.userId) {
      console.log('⛔ [JwtStrategy] Invalid payload structure'); // 🔥 ЛОГ 5
      throw new UnauthorizedException();
    }

    return { userId: payload.userId };
  }
}
