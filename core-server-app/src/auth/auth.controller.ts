import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { Request, type Response } from 'express';
import { CoreAuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly coreAuthService: CoreAuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1. Делегируем всю работу сервису
    const { accessToken, refreshToken } =
      await this.coreAuthService.handleSignUp(signUpDto);

    // 2. Устанавливаем HttpOnly куки (как по схеме!)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // В production всегда true
      sameSite: 'strict',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh', // Refresh-токен должен быть доступен только для /auth/refresh
    });

    // 3. Отправляем ответ
    return { message: 'Registration successful' };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1. Делегируем
    const { accessToken, refreshToken } =
      await this.coreAuthService.login(loginDto);

    // 2. Устанавливаем куки (так же, как при регистрации)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    // 3. Отправляем ответ
    return { message: 'Login successful' };
  }

  // TODO: Добавить /logout и /refresh
}
