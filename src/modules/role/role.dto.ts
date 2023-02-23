import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PageOptionsDto } from '@/modules/core/dto/page.dto';
import { User } from '@/entities/user.entity';
/** 角色新增dto */
export class CreateRoleDto {
  /** 角色名称 */
  @ApiProperty({
    description: '角色名称',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  /** 角色权限 */
  @ApiProperty({
    description: '角色权限',
    required: false,
  })
  @IsString()
  @IsOptional()
  permission: string;

  /** 角色备注 */
  @ApiProperty({
    description: '角色备注',
    required: false,
  })
  @IsString()
  @IsOptional()
  remark: string;

  /** 创建人 */
  @ApiProperty({
    description: '创建人',
    required: false,
  })
  @IsOptional()
  creator: User;
}

/** 角色更新dto */
export class UpdateRoleDto {
  /** 角色名称 */
  @ApiProperty({
    description: '角色名称',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  name: string;

  /** 角色权限 */
  @ApiProperty({
    description: '角色权限',
    required: false,
  })
  @IsString()
  @IsOptional()
  permission: string;

  /** 角色备注 */
  @ApiProperty({
    description: '角色备注',
    required: false,
  })
  @IsString()
  @IsOptional()
  remark: string;

  /** 修改人 */
  @ApiProperty({
    description: '修改人',
    required: true,
  })
  editor: User;
}

/** 角色分页查询dto */
export class PageSearchRoleDto extends PageOptionsDto {
  @ApiProperty({
    required: false,
    description: '是否分页(默认分页)',
  })
  @IsBoolean()
  @IsOptional()
  isPagination?: boolean = true;

  @ApiProperty({
    required: false,
    description: '角色名称',
  })
  @IsString()
  @IsOptional()
  name: string;
}
