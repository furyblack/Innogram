import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsDateString()
  @IsNotEmpty()
  birthday: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
