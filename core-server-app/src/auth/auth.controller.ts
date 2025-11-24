import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Request, type Response } from 'express';
import { CoreAuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

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
      secure: false, // В production всегда true
      sameSite: 'strict',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/auth/refresh', // Refresh-токен должен быть доступен только для /auth/refresh
    });

    // 3. Отправляем ответ
    return { message: 'Registration successful 1111' };
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
      secure: false,
      sameSite: 'strict',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    // 3. Отправляем ответ
    return { message: 'Login successful' };
  }

  // TODO: Добавить /logout и /refresh

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Инициализация аутентификации через Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // req.user содержит то, что вернул метод validate() из стратегии
    const { accessToken, refreshToken } =
      await this.coreAuthService.handleSocialLogin(req.user);

    // Устанавливаем куки
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    // Редирект на фронтенд (или просто ответ JSON для теста)
    // res.redirect('http://localhost:3000/frontend-home');
    return res.send({ message: 'Google Login Successful' });
  }
}
