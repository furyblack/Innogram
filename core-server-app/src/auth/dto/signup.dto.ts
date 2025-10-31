import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8) // Пример: минимальная длина пароля 8 символов
  password: string;

  @IsString()
  @MinLength(3) // Пример: минимальная длина username
  username: string;
}
