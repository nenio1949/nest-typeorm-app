import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserGenderEnum, UserStatusEnum } from '../enums/user.enum';
import { Role } from './role.entity';
import { Department } from './department.entity';

/** 用户entity */
@Entity({ name: 'User' })
export class User extends BaseEntity {
  /** 姓名 */
  @Column({ comment: '姓名', length: 50, nullable: false })
  @ApiProperty()
  name: string;

  /** 性别 */
  @Column({
    type: 'enum',
    enum: UserGenderEnum,
    comment: '性别',
    default: UserGenderEnum.未知,
    nullable: false,
  })
  @ApiProperty()
  gender: UserGenderEnum;

  /** 手机号 */
  @Column({ comment: '手机号', length: 11, nullable: false })
  @ApiProperty()
  mobile: string;

  /** 账号 */
  @Column({
    comment: '账号',
    length: 20,
    nullable: false,
    unique: true,
  })
  @ApiProperty()
  account: string;

  /** 密码 */
  @Column({ comment: '密码', length: 50, nullable: false, select: false })
  @ApiProperty()
  password: string;

  /** 邮箱 */
  @Column({ comment: '邮箱', length: 50, nullable: true })
  @ApiProperty()
  email: string;

  /** 状态 */
  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    comment: '状态',
    default: UserStatusEnum.正常,
  })
  @ApiProperty()
  status: UserStatusEnum;

  /** 角色 */
  @ApiProperty({ type: () => Role })
  @ManyToOne(() => Role, (role) => role.id, { nullable: true })
  @JoinColumn()
  role: Role;

  /** 部门 */
  @ApiProperty({ type: () => Department })
  @ManyToOne(() => Department, (department) => department.id, {
    nullable: true,
  })
  @JoinColumn()
  department: Department;

  /** 最后登录IP */
  @Column({ comment: '最后登录IP', length: 20, nullable: true })
  @ApiProperty()
  lastLoginIP: string;

  /** 最后登录时间 */
  @Column({ comment: '最后登录时间', nullable: true })
  @ApiProperty()
  lastLoginTime: Date;
}
