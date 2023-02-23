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
import { Department } from '@/entities/department.entity';
import {
  CreateDepartmentDto,
  PageSearchDepartmentDto,
  UpdateDepartmentDto,
} from './department.dto';
import { DepartmentService } from './department.service';
import { UserService } from '../user/user.service';
import { User } from '@/entities/user.entity';
import { dtoToEntity } from '@/utils/dtoToEntity';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { ICurrentUser } from '@/modules/core/interface/admin.interface';

@ApiTags('部门模块')
@Controller('v1/departments')
export class DepartmentController {
  constructor(
    private departmentService: DepartmentService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: '分页查询部门信息' })
  @ApiOkResponse({ type: [Department] })
  @Get()
  async page(
    @Query() dto: PageSearchDepartmentDto,
  ): Promise<PaginatedResponseDto<Department> | Department[]> {
    if (dto.isPagination) {
      // 分页查询
      const [list, total] = await this.departmentService.page(dto);
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
      return await this.departmentService.list();
    }
  }

  @ApiOperation({ summary: '删除部门' })
  @ApiOkResponse({ type: Number })
  @Delete('/:ids')
  async delete(@Param('ids') ids: string): Promise<number> {
    const idArr = ids.split(',').map(Number);

    return await this.departmentService.delete(idArr);
  }

  @ApiOperation({ summary: '新增部门' })
  @ApiOkResponse({ type: Number })
  @Post()
  async add(
    @Body() dto: CreateDepartmentDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<number> {
    const department = new Department();
    const currentUser = await this.userService.info(user.uid);
    dtoToEntity(dto, department);
    department.creator = currentUser;
    department.editor = currentUser;
    let parentDepartment = new Department();
    let leader = new User();
    if (dto.parentId) {
      parentDepartment = await this.departmentService.info(dto.parentId);
      if (!parentDepartment) {
        throw new Error('所选父级部门不存在！');
      }
      department.parentDepartment = parentDepartment;
    }

    if (dto.leaderId) {
      leader = await this.userService.info(dto.leaderId);
      if (!leader) {
        throw new Error('所选部门负责人不存在！');
      }
      department.leader = leader;
    }

    return await this.departmentService.add(department);
  }

  @ApiOperation({ summary: '更新部门' })
  @ApiOkResponse({ type: Boolean })
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<boolean> {
    const currentUser = await this.userService.info(user.uid);
    const department = await this.departmentService.info(id);
    if (!department) {
      throw new Error('部门不存在！');
    }

    if (dto.parentId) {
      if (department.parentDepartment.id !== dto.parentId) {
        const parentDepartment = await this.departmentService.info(
          dto.parentId,
        );
        if (!parentDepartment) {
          throw new Error('所选上级部门不存在！');
        }
        department.parentDepartment = parentDepartment;
      }
    } else {
      if (dto.parentId === 0) {
        department.parentDepartment = null;
      }
    }

    if (dto.leaderId) {
      if (department.leader.id !== dto.leaderId) {
        const leader = await this.userService.info(dto.leaderId);
        if (!leader) {
          throw new Error('所选部门负责人不存在！');
        }
        department.leader = leader;
      }
    } else {
      if (dto.leaderId === 0) {
        department.leader = null;
      }
    }

    dtoToEntity(dto, department);
    department.editor = currentUser;
    return await this.departmentService.update(department);
  }

  @ApiOperation({ summary: '获取部门信息' })
  @ApiOkResponse({ type: Department })
  @Get('/:id')
  async info(@Param('id') id: number): Promise<Department> {
    return await this.departmentService.info(id);
  }
}
