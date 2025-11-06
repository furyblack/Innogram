import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Для чтения env-переменных
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

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
}
