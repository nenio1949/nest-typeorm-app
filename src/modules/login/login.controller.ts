import { Controller, Post, Req, Body, Headers } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginDto } from './login.dto';
import { FastifyRequest } from 'fastify';
import { UtilService } from '@/shared/services/util.service';
import { Authorize } from '../core/decorators/authorize.decorator';
import { LoginResponse } from './login.dto';

@ApiTags('登录模块')
@Controller('v1')
export class LoginController {
  constructor(private loginService: LoginService, private utils: UtilService) {}

  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({ type: LoginResponse })
  @Authorize()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: FastifyRequest,
    @Headers('user-agent') ua: string,
  ): Promise<LoginResponse> {
    dto.ip = this.utils.getReqIP(req);
    dto.ua = ua;
    return await this.loginService.login(dto);
  }
}
