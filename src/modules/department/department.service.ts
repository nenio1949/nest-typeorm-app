import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Department } from '@/entities/department.entity';
import { EntityManager, Like, Not, Repository } from 'typeorm';
import { PageSearchDepartmentDto } from './department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  /**
   * 列举所有部门
   */
  async list(): Promise<Department[]> {
    return await this.departmentRepository.find({
      where: { deleted: false },
    });
  }

  /**
   * 列举所有部门条数
   */
  async count(): Promise<number> {
    return await this.departmentRepository.count({
      where: { deleted: false },
    });
  }

  /**
   * 根据部门获取部门信息
   */
  async info(id: number): Promise<Department> {
    return await this.departmentRepository.findOne({
      where: { id: id, deleted: false },
    });
  }

  /**
   * 根据部门Id数组删除
   */
  async delete(ids: number[], isForced = false): Promise<number> {
    let res = 0;
    if (isForced) {
      await this.entityManager.transaction(async (manager) => {
        res = (await manager.delete(Department, ids)).affected;
      });
    } else {
      res = (
        await this.departmentRepository.update(ids, {
          deleted: false,
          editor: null,
        })
      ).affected;
    }
    return res;
  }

  /**
   * 增加部门
   */
  async add(param: Department): Promise<number> {
    const sameNameDepartment = await this.departmentRepository.exist({
      where: { deleted: false, name: param.name },
    });
    if (sameNameDepartment) {
      throw new Error('部门已存在!');
    }

    const department = await this.departmentRepository.insert(param);
    return parseInt(department.identifiers[0]?.id);
  }

  /**
   * 更新部门信息
   */
  async update(department: Department): Promise<boolean> {
    const sameNameDepartment = await this.departmentRepository.exist({
      where: { name: department.name, id: Not(department.id), deleted: false },
    });

    if (sameNameDepartment) {
      throw new Error('部门已存在!');
    }

    const res = await this.departmentRepository.update(
      department.id,
      department,
    );

    return res.affected === 1;
  }

  /**
   * 分页加载部门信息
   */
  async page(param: PageSearchDepartmentDto): Promise<[Department[], number]> {
    const { size, page, name } = param;
    const where: any = {
      deleted: false,
    };

    if (param.name) {
      where.name = Like(`%${name}%`);
    }
    const result = await this.departmentRepository.findAndCount({
      where,
      order: {
        id: 'ASC',
      },
      take: size,
      skip: (page - 1) * size,
    });
    return result;
  }
}
