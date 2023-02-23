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
import { User } from '@/entities/user.entity';
import { CreateUserDto, PageSearchUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { dtoToEntity } from '@/utils/dtoToEntity';
import { RoleService } from '../role/role.service';
import { DepartmentService } from '../department/department.service';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { ICurrentUser } from '@/modules/core/interface/admin.interface';

@ApiTags('用户模块')
@Controller('v1/users')
export class UserController {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private departmentService: DepartmentService,
  ) {}

  @ApiOperation({ summary: '获取用户列表' })
  @ApiOkResponse({ type: [User] })
  @Get()
  async page(
    @Query() dto: PageSearchUserDto,
  ): Promise<PaginatedResponseDto<User> | User[]> {
    if (dto.isPagination) {
      // 分页查询
      const [list, total] = await this.userService.page(dto);
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
      return await this.userService.list();
    }
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiOkResponse({ type: Number })
  @Delete('/:ids')
  async delete(@Param('ids') ids: string): Promise<number> {
    const idArr = ids.split(',').map(Number);
    return await this.userService.delete(idArr);
  }

  @ApiOperation({ summary: '新增用户' })
  @ApiOkResponse({ type: Number })
  @Post()
  async add(
    @Body() dto: CreateUserDto,
    @CurrentUser() adminUser: ICurrentUser,
  ): Promise<number> {
    const user = new User();
    const currentUser = await this.userService.info(adminUser.uid);
    dtoToEntity(dto, user);
    if (dto.roleId) {
      const role = await this.roleService.info(dto.roleId);
      if (!role) {
        throw new Error('所选角色不存在！');
      }
      user.role = role;
    }
    if (dto.departmentId) {
      const department = await this.departmentService.info(dto.departmentId);
      if (!department) {
        throw new Error('所选部门不存在！');
      }
      user.department = department;
    }
    user.creator = currentUser;
    user.editor = currentUser;
    return await this.userService.add(user);
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiOkResponse({ type: Boolean })
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() adminUser: ICurrentUser,
  ): Promise<boolean> {
    const currentUser = await this.userService.info(adminUser.uid);
    const user = await this.userService.info(id);
    if (!user) {
      throw new Error('用户不存在');
    }

    dto.editor = currentUser;
    return await this.userService.update(user);
  }

  @ApiOperation({ summary: '获取用户信息' })
  @ApiOkResponse({ type: User })
  @Get('/:id')
  async info(@Param('id') id: number): Promise<User> {
    return await this.userService.info(id);
  }
}
