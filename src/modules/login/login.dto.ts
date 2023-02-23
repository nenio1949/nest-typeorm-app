import { User } from '@/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  /** 账号 */
  @ApiProperty({
    description: '账号',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  account: string;

  /** 密码 */
  @ApiProperty({
    description: '密码',
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty()
  password: string;

  /** ip */
  @ApiProperty({
    description: 'ip',
    required: false,
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  ip: string;

  /** ua */
  @ApiProperty({
    description: 'ua',
    required: false,
  })
  @IsOptional()
  ua: string;
}

/** 登录响应 */
export class LoginResponse {
  @ApiProperty({ description: 'JWT身份Token' })
  token: string;

  @ApiProperty({ description: '用户信息' })
  user: User;
}
