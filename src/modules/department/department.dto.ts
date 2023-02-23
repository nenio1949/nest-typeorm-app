import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PageOptionsDto } from '@/modules/core/dto/page.dto';
import { Department } from '@/entities/department.entity';
import { User } from '@/entities/user.entity';
/** 部门新增dto */
export class CreateDepartmentDto {
  /** 部门名称 */
  @ApiProperty({
    description: '部门名称',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty({ message: '部门名称不能为空' })
  name: string;

  /** 上级部门 */
  @ApiProperty({
    description: '上级部门',
    required: false,
  })
  @IsInt()
  @IsOptional()
  parentId: number;

  /** 部门负责人 */
  @ApiProperty({
    description: '部门负责人',
    required: false,
  })
  @IsInt()
  @IsOptional()
  leaderId: number;

  /** 创建人 */
  @ApiProperty({
    description: '创建人',
    required: false,
  })
  @IsOptional()
  creator: Department;

  /** 修改人 */
  @ApiProperty({
    description: '修改人',
    required: false,
  })
  @IsOptional()
  editor: Department;
}

/** 部门更新dto */
export class UpdateDepartmentDto {
  /** 部门名称 */
  @ApiProperty({
    description: '部门名称',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  name: string;

  /** 上级部门 */
  @ApiProperty({
    description: '上级部门',
    required: false,
  })
  @IsInt()
  @IsOptional()
  parentId: number;

  /** 部门负责人 */
  @ApiProperty({
    description: '部门负责人',
    required: false,
  })
  @IsInt()
  @IsOptional()
  leaderId: number;

  /** 修改人 */
  @ApiProperty({
    description: '修改人',
    required: false,
  })
  @IsOptional()
  editor: User;
}

/** 部门分页查询dto */
export class PageSearchDepartmentDto extends PageOptionsDto {
  @ApiProperty({
    required: false,
    description: '部门名称',
  })
  @IsString()
  @IsOptional()
  name: string;
}
