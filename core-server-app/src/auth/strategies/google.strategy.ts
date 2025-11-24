import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptions,
} from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    // 1. Читаем из .env, а если там пусто — берем ПРАВИЛЬНЫЙ дефолт
    const callbackURL =
      configService.get<string>('GOOGLE_CALLBACK_URL') ||
      'http://localhost:3001/api/auth/google/callback';

    console.log('🔧 Google Strategy Callback URL:', callbackURL); // Лог для проверки

    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: callbackURL, // <-- Используем правильную переменную
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;

    const user = {
      email: emails[0].value,
      displayName: `${name.givenName} ${name.familyName}`,
      username: emails[0].value.split('@')[0] + '_' + id.slice(-4),
      provider: 'google',
      providerId: id,
      avatarUrl: photos[0].value,
    };

    done(null, user);
  }
}
