import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsInt,
  IsMobilePhone,
} from 'class-validator';
import { PageOptionsDto } from '@/modules/core/dto/page.dto';
import { UserGenderEnum, UserStatusEnum } from '@/enums/user.enum';
import { User } from '@/entities/user.entity';
/** 用户新增dto */
export class CreateUserDto {
  /** 姓名 */
  @ApiProperty({
    description: '姓名',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty({ message: '姓名不能为空！' })
  name: string;

  /** 性别 */
  @ApiProperty({
    description: '性别',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;

  /** 手机号 */
  @ApiProperty({
    description: '手机号',
    required: true,
  })
  @MinLength(11)
  @MaxLength(11)
  @IsMobilePhone()
  @IsNotEmpty({ message: '手机号不能为空！' })
  mobile: string;

  /** 账号 */
  @ApiProperty({
    description: '账号',
    required: true,
  })
  @MinLength(4)
  @MaxLength(50)
  @IsNotEmpty({ message: '账号不能为空！' })
  account: string;

  /** 密码 */
  @ApiProperty({
    description: '密码',
    required: true,
  })
  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty({ message: '密码不能为空！' })
  password: string;

  /** 邮箱 */
  @ApiProperty({
    description: '邮箱',
    required: false,
  })
  @MinLength(6)
  @MaxLength(50)
  @IsEmail()
  @IsOptional()
  email: string;

  /** 角色id */
  @ApiProperty({
    description: '角色id',
    required: false,
  })
  @IsInt()
  @IsOptional()
  roleId: number;

  /** 部门id */
  @ApiProperty({
    description: '部门id',
    required: false,
  })
  @IsInt()
  @IsOptional()
  departmentId: number;

  /** 创建人 */
  @ApiProperty({
    description: '创建人',
    required: false,
  })
  @IsOptional()
  creator: User;
}

/** 用户更新dto */
export class UpdateUserDto {
  /** 姓名 */
  @ApiProperty({
    description: '姓名',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  name: string;

  /** 性别 */
  @ApiProperty({
    description: '性别',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;

  /** 手机号 */
  @ApiProperty({
    description: '手机号',
    required: true,
  })
  @MinLength(11)
  @MaxLength(11)
  @IsMobilePhone()
  @IsOptional()
  mobile: string;

  /** 邮箱 */
  @ApiProperty({
    description: '邮箱',
    required: false,
  })
  @MinLength(6)
  @MaxLength(50)
  @IsOptional()
  @IsEmail()
  email: string;

  /** 状态 */
  @ApiProperty({
    description: '状态',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;

  /** 角色id */
  @ApiProperty({
    description: '角色id',
    required: false,
  })
  @IsInt()
  @IsOptional()
  roleId: number;

  /** 部门id */
  @ApiProperty({
    description: '部门id',
    required: false,
  })
  @IsInt()
  @IsOptional()
  departmentId: number;

  /** 修改人 */
  @ApiProperty({
    description: '修改人',
    required: false,
  })
  @IsOptional()
  editor: User;
}

/** 用户分页查询dto */
export class PageSearchUserDto extends PageOptionsDto {
  @ApiProperty({
    required: false,
    description: '用户名称',
  })
  @IsString()
  @IsOptional()
  name: string;
}

/** 用户信息dto */
export class UserDto extends OmitType(User, ['password'] as const) {}
