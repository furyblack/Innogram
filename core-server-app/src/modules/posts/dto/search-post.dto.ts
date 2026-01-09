import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';

export class SearchPostDto extends PaginationDto {
  @IsString()
  @IsOptional()
  q?: string;
}
