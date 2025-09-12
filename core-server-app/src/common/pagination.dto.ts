import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number) // Преобразуем строковый query-параметр в число
  @IsInt()
  @Min(1)
  page?: number = 1; // Номер страницы по умолчанию

  @IsOptional()
  @Type(() => Number) // Преобразуем строковый query-параметр в число
  @IsInt()
  @Min(1)
  @Max(100) // Устанавливаем максимальный лимит, чтобы защититься от DDoS
  limit?: number = 10; // Лимит по умолчанию
}
