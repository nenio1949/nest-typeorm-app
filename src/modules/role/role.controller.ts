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
import { PaginatedResponseDto } from '@/common/dto/page.dto';
import { Role } from '@/entities/role.entity';
import { CreateRoleDto, PageSearchRoleDto, UpdateRoleDto } from './role.dto';
import { RoleService } from './role.service';
import { dtoToEntity } from '@/utils/dtoToEntity';
import { ICurrentUser } from '@/common/interface.ts/admin.interface';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { UserService } from '../user/user.service';

@ApiTags('角色模块')
@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: '获取角色列表' })
  @ApiOkResponse({ type: [Role] })
  @Get('list')
  async list(): Promise<Role[]> {
    return await this.roleService.list();
  }

  @ApiOperation({ summary: '分页查询角色信息' })
  @ApiOkResponse({ type: [Role] })
  @Get()
  async page(
    @Query() dto: PageSearchRoleDto,
  ): Promise<PaginatedResponseDto<Role>> {
    const [list, total] = await this.roleService.page(dto);
    return {
      list,
      pagination: {
        size: dto.size,
        page: dto.page,
        total,
      },
    };
  }

  @ApiOperation({ summary: '删除角色' })
  @Delete('/:ids')
  async delete(@Param('ids') ids: string): Promise<boolean> {
    const idArr = ids.split(',').map(Number);

    return await this.roleService.delete(idArr);
  }

  @ApiOperation({ summary: '新增角色' })
  @Post()
  async add(
    @Body() dto: CreateRoleDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<number> {
    const role = new Role();
    const currentUser = await this.userService.info(user.uid);
    dtoToEntity(dto, role);
    role.creator = currentUser;
    role.editor = currentUser;
    return await this.roleService.add(role);
  }

  @ApiOperation({ summary: '更新角色' })
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<boolean> {
    const currentUser = await this.userService.info(user.uid);
    const role = await this.roleService.info(id);
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
