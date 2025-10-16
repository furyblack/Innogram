import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Указываем, что токен будет в заголовке Authorization как Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Не игнорируем истекший срок годности токена
      ignoreExpiration: false,
      // Используем тот же секрет, что и в auth-service
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // Этот метод вызывается, если токен прошел проверку подписи.
  // Он получает "расшифрованное" содержимое токена (payload).
  async validate(payload: any) {
    // То, что вернет этот метод, будет записано в req.user
    return { userId: payload.userId, email: payload.email };
  }
}
