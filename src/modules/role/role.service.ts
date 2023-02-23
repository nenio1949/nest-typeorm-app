import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Role } from '@/entities/role.entity';
import { EntityManager, Like, Not, Repository } from 'typeorm';
import { PageSearchRoleDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  /**
   * 列举所有角色：除去超级管理员
   */
  async list(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { deleted: false },
    });
  }

  /**
   * 列举所有角色条数：除去超级管理员
   */
  async count(): Promise<number> {
    return await this.roleRepository.count({
      where: { deleted: false },
    });
  }

  /**
   * 根据角色获取角色信息
   */
  async info(id: number): Promise<Role> {
    return await this.roleRepository.findOne({
      where: { id: id, deleted: false },
    });
  }

  /**
   * 根据角色Id数组删除
   */
  async delete(ids: number[], isForced = false): Promise<number> {
    let res = 0;
    if (isForced) {
      await this.entityManager.transaction(async (manager) => {
        res = (await manager.delete(Role, ids)).affected;
      });
    } else {
      res = (
        await this.roleRepository.update(ids, {
          deleted: false,
          editor: null,
        })
      ).affected;
    }
    return res;
  }

  /**
   * 增加角色
   */
  async add(param: Role): Promise<number> {
    const sameNameRole = await this.roleRepository.exist({
      where: { deleted: false, name: param.name },
    });
    if (sameNameRole) {
      throw new Error('角色已存在!');
    }
    const role = await this.roleRepository.insert(param);
    return parseInt(role.identifiers[0]?.id);
  }

  /**
   * 更新角色信息
   */
  async update(role: Role): Promise<boolean> {
    const sameNameRole = await this.roleRepository.exist({
      where: { name: role.name, id: Not(role.id), deleted: false },
    });

    if (sameNameRole) {
      throw new Error('角色已存在!');
    }

    const res = await this.roleRepository.update(role.id, role);

    return res.affected === 1;
  }

  /**
   * 分页加载角色信息
   */
  async page(param: PageSearchRoleDto): Promise<[Role[], number]> {
    const { size, page, name } = param;
    const where: any = {
      deleted: false,
    };

    if (param.name) {
      where.name = Like(`%${name}%`);
    }
    const result = await this.roleRepository.findAndCount({
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
