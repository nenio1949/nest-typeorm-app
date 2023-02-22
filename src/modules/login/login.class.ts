import { User } from '@/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

/** 登录响应 */
export class LoginResponse {
  @ApiProperty({ description: 'JWT身份Token' })
  token: string;

  @ApiProperty({ description: '用户信息' })
  user: User;
}
