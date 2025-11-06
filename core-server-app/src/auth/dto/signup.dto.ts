import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsDateString, // <-- Добавь этот импорт
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8) // (или какая у тебя валидация)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  // --- ВОТ ЭТО НУЖНО ДОБАВИТЬ ---

  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsDateString() // Проверяет, что это строка в формате даты (напр. '1990-10-20')
  @IsNotEmpty()
  birthday: string;
}
