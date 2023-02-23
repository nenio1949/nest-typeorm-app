import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PageOptionsDto {
  /** 当前页包含数量(默认10) */
  @ApiProperty({
    description: '当前页包含数量(默认10)',
    required: false,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly size: number = 10;

  /** 当前页(默认1) */
  @ApiProperty({
    description: '当前页(默认1)',
    required: false,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;
}

export class Pagination {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;
}

export class PaginatedResponseDto<T> {
  list: Array<T>;

  @ApiProperty()
  pagination: Pagination;
}
