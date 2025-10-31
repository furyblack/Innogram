import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Для чтения env-переменных
import { firstValueFrom } from 'rxjs';

// Интерфейс для ответа от Auth-Service
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class CoreAuthService {
  private authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Собираем URL из env-переменных, которые у вас в docker-compose
    const host = this.configService.get<string>('AUTH_SERVICE_HOST'); // 'auth-service'
    const port = this.configService.get<string>('AUTH_SERVICE_PORT'); // '4000'
    this.authServiceUrl = `http://${host}:${port}`;
  }

  async handleSignUp(signUpDto: any): Promise<AuthTokens> {
    try {
      // Делаем ВНУТРЕННИЙ HTTP-запрос на http://auth-service:4000/register
      const response = await firstValueFrom(
        this.httpService.post<AuthTokens>(
          `${this.authServiceUrl}/api/auth/register`, // Этот путь должен совпадать с путем в auth-service
          signUpDto,
        ),
      );
      // auth-service должен вернуть JSON вида { accessToken, refreshToken }
      return response.data;
    } catch (error) {
      // TODO: Обработать ошибки (например, "user already exists")
      throw new InternalServerErrorException(
        'Registration failed',
        error.message,
      );
    }
  }

  async login(loginDto: any): Promise<AuthTokens> {
    try {
      // Делаем ВНУТРЕННИЙ HTTP-запрос на http://auth-service:4000/login
      const response = await firstValueFrom(
        this.httpService.post<AuthTokens>(
          `${this.authServiceUrl}/api/auth/login`, // Этот путь должен совпадать с путем в auth-service
          loginDto,
        ),
      );
      // auth-service должен вернуть JSON вида { accessToken, refreshToken }
      return response.data;
    } catch (error) {
      // TODO: Обработать ошибки (401 - "invalid credentials")
      throw new InternalServerErrorException('Login failed', error.message);
    }
  }
}
