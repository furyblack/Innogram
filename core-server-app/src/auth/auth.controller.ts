import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
  HttpCode,
} from '@nestjs/common';
import { Request, type Response } from 'express';
import { CoreAuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/modules/users/decorators/current-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly coreAuthService: CoreAuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.coreAuthService.handleSignUp(signUpDto);

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

    return { message: 'Registration successful 1111' };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.coreAuthService.login(loginDto);

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

    return { message: 'Login successful' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

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

    return res.send({ message: 'Google Login Successful' });
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt')) // Только залогиненный может выйти
  @HttpCode(200)
  async logout(
    @CurrentUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1. Удаляем сессию в Redis (через auth-service)
    await this.coreAuthService.logout(userId);

    // 2. Очищаем куки (ВАЖНО!)
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/auth/refresh' }); // Путь важен, если он был задан при создании

    return { message: 'Logged out successfully' };
  }
}
