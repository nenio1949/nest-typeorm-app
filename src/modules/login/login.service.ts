import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
import { UserService } from '../user/user.service';
import { RedisService } from '@/shared/services/redis.service';
import { LoginResponse } from './login.class';

@Injectable()
export class LoginService {
  constructor(
    private userService: UserService,
    private redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description: 登录
   * @param {LoginDto} 登录dto
   * @return {*}
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.infoByAccount(
      dto.account,
      dto.password,
    );

    const jwtSign = this.jwtService.sign({ uid: user.id, pv: dto.ua });
    // Token设置过期时间 14天
    await this.redisService
      .getRedis()
      .set(`admin:token:${user.id}`, jwtSign, 'EX', 60 * 60 * 24 * 14);

    user.lastLoginTime = new Date();
    user.lastLoginIP = dto.ip;
    this.userService.update(user);
    return {
      user,
      token: jwtSign,
    };
  }

  async getRedisPasswordVersionById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:passwordVersion:${id}`);
  }

  async getRedisTokenById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:token:${id}`);
  }

  async getRedisPermsById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:perms:${id}`);
  }
}
