import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@/modules/core/dto/page.dto';
import { Role } from '@/entities/role.entity';
import { CreateRoleDto, PageSearchRoleDto, UpdateRoleDto } from './role.dto';
import { RoleService } from './role.service';
import { dtoToEntity } from '@/utils/dtoToEntity';
import { ICurrentUser } from '@/modules/core/interface/admin.interface';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { UserService } from '../user/user.service';

@ApiTags('角色模块')
@Controller('v1/roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: '获取角色列表' })
  @ApiOkResponse({ type: [Role] })
  @Get()
  async page(
    @Query() dto: PageSearchRoleDto,
  ): Promise<PaginatedResponseDto<Role> | Role[]> {
    if (dto.isPagination) {
      // 分页查询
      const [list, total] = await this.roleService.page(dto);
      return {
        list,
        pagination: {
          size: dto.size,
          page: dto.page,
          total,
        },
      };
    } else {
      // 查询所有
      return await this.roleService.list();
    }
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiOkResponse({ type: Number })
  @Delete('/:ids')
  async delete(@Param('ids') ids: string): Promise<number> {
    const idArr = ids.split(',').map(Number);

    return await this.roleService.delete(idArr);
  }

  @ApiOperation({ summary: '新增角色' })
  @ApiOkResponse({ type: Number })
  @Post()
  async add(
    @Body() dto: CreateRoleDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<number> {
    const role = new Role();
    const currentUser = await this.userService.info(user.uid);
    dtoToEntity(dto, role);
    role.creator = currentUser;
    return await this.roleService.add(role);
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiOkResponse({ type: Boolean })
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<boolean> {
    const currentUser = await this.userService.info(user.uid);
    const role = await this.roleService.info(id);
    if (!role) {
      throw new Error('角色不存在！');
    }
    dtoToEntity(dto, role);
    role.editor = currentUser;
    return await this.roleService.update(role);
  }

  @ApiOperation({ summary: '获取角色信息' })
  @ApiOkResponse({ type: Role })
  @Get('/:id')
  async info(@Param('id') id: number): Promise<Role> {
    return await this.roleService.info(id);
  }
}
