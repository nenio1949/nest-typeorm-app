import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

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
  @IsOptional()
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
  @IsOptional()
  readonly page: number = 1;

  @ApiProperty({
    required: false,
    description: '是否分页(默认分页)',
  })
  @IsOptional()
  isPagination?: boolean = true;
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
