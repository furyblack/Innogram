import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

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
      // auth-service должен вернуть JSON вида { accessToken, refreshToken }//
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new InternalServerErrorException('Signup failed', error.message);
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
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new InternalServerErrorException('Login failed', error.message);
    }
  }

  async handleSocialLogin(userProfile: any): Promise<AuthTokens> {
    try {
      // Шлем POST запрос в Auth Service
      const response = await firstValueFrom(
        this.httpService.post<AuthTokens>(
          `${this.authServiceUrl}/api/auth/social-login`,
          userProfile,
        ),
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Social login failed',
        error.message,
      );
    }
  }

  // ...
  async logout(userId: string): Promise<void> {
    try {
      // Сообщаем auth-service, что надо удалить токен из Redis
      await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/api/auth/logout`, {
          userId,
        }),
      );
    } catch (error) {
      // Не критично, если Redis уже пуст, главное куки очистить
      console.error('Error calling auth-service logout:', error.message);
    }
  }

  async refresh(oldRefreshToken: string): Promise<AuthTokens> {
    try {
      // Шлем запрос в Auth Service: POST /api/auth/refresh
      // Передаем старый токен в теле запроса
      const response = await firstValueFrom(
        this.httpService.post<AuthTokens>(
          `${this.authServiceUrl}/api/auth/refresh`,
          { refreshToken: oldRefreshToken },
        ),
      );
      return response.data;
    } catch (error) {
      // Если Auth Service вернул ошибку (например, токен протух или в черном списке)
      // Мы должны выбросить 401, чтобы клиент понял, что надо релогиниться
      throw new HttpException(
        error.response?.data || 'Refresh failed',
        error.response?.status || 401,
      );
    }
  }
}
