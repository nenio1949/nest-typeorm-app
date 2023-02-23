import { LoginService } from '@/modules/login/login.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { isEmpty } from 'lodash';
import { ApiException } from 'src/common/exceptions/api.exception';
import {
  ADMIN_USER,
  AUTHORIZE_KEY_METADATA,
} from '@/common/contants/admin.constants';

/**
 * admin perm check guard
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private loginService: LoginService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检测是否是开放类型的，例如获取验证码类型的接口不需要校验，可以加入@Authorize可自动放过
    const authorize = this.reflector.get<boolean>(
      AUTHORIZE_KEY_METADATA,
      context.getHandler(),
    );
    if (authorize) {
      return true;
    }
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const authorization = request.headers['authorization'] as string;
    if (!authorization) {
      throw new ApiException(11001);
    }
    const token = authorization.replace('Bearer ', '');
    if (isEmpty(token)) {
      throw new ApiException(11001);
    }
    try {
      // 挂载对象到当前请求上
      request[ADMIN_USER] = this.jwtService.verify(token);
    } catch (e) {
      // 无法通过token校验
      throw new ApiException(11001);
    }
    if (isEmpty(request[ADMIN_USER])) {
      throw new ApiException(11001);
    }

    const redisToken = await this.loginService.getRedisTokenById(
      request[ADMIN_USER].uid,
    );
    if (token !== redisToken) {
      // 与redis保存不一致
      throw new ApiException(11002);
    }
    // pass
    return true;
  }
}
