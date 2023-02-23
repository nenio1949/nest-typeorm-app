import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { EntityManager, Like, Not, Repository } from 'typeorm';
import { PageSearchUserDto } from './user.dto';
import { UtilService } from '@/shared/services/util.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectEntityManager() private entityManager: EntityManager,
    private utils: UtilService,
  ) {}

  /**
   * 列举所有用户
   */
  async list(): Promise<User[]> {
    return await this.userRepository.find({
      where: { deleted: false },
    });
  }

  /**
   * 列举所有用户条数：除去超级管理员
   */
  async count(): Promise<number> {
    return await this.userRepository.count({
      where: { deleted: false },
    });
  }

  /**
   * 根据id获取用户信息
   */
  async info(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id, deleted: false },
    });
  }

  /**
   * 根据账号密码获取用户信息
   * @param account 账号
   * @param password 密码
   * @returns User|null
   */
  async infoByAccount(account: string, password: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { deleted: false, account: account, password: password },
    });
  }

  /**
   * 根据用户Id数组删除
   */
  async delete(ids: number[], isForced = false): Promise<number> {
    let res = 0;
    if (isForced) {
      await this.entityManager.transaction(async (manager) => {
        res = (await manager.delete(User, ids)).affected;
      });
    } else {
      res = (
        await this.userRepository.update(ids, {
          deleted: false,
          editor: null,
        })
      ).affected;
    }
    return res;
  }

  /**
   * 增加用户
   */
  async add(param: User): Promise<number> {
    const sameAccountUser = await this.userRepository.exist({
      where: { deleted: false, account: param.account },
    });
    if (sameAccountUser) {
      throw new Error('用户已存在!');
    }

    if (!this.utils.isMobile(param.mobile)) {
      throw new Error('手机号格式校验不通过！');
    }

    const sameMobileUser = await this.userRepository.exist({
      where: { deleted: false, mobile: param.mobile },
    });
    if (sameMobileUser) {
      throw new Error('手机号已被注册!');
    }
    const user = await this.userRepository.insert(param);
    return parseInt(user.identifiers[0].id);
  }

  /**
   * 更新用户信息
   */
  async update(user: User): Promise<boolean> {
    const sameNameUser = await this.userRepository.exist({
      where: { name: user.name, id: Not(user.id), deleted: false },
    });

    if (sameNameUser) {
      throw new Error('用户已存在!');
    }

    if (user.mobile) {
      if (!this.utils.isMobile(user.mobile)) {
        throw new Error('手机号格式校验不通过！');
      }
    }

    const res = await this.userRepository.update(user.id, user);

    return res.affected == 1;
  }

  /**
   * 分页加载用户信息
   */
  async page(param: PageSearchUserDto): Promise<[User[], number]> {
    const { size, page, name } = param;
    const where: any = {
      deleted: false,
    };

    if (param.name) {
      where.name = Like(`%${name}%`);
    }
    const result = await this.userRepository.findAndCount({
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
