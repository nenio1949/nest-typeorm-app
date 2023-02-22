import { ApiProperty } from '@nestjs/swagger';
import { Column, ManyToOne, JoinColumn, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

/** 部门entity */
@Entity({ name: 'Department' })
export class Department extends BaseEntity {
  /** 名称 */
  @Column({ comment: '名称', length: 50, nullable: false, unique: true })
  @ApiProperty()
  name: string;

  /** 父级部门 */
  @ApiProperty({ type: () => Department })
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn()
  parentDepartment: Department;

  /** 部门负责人 */
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  leader: User;
}
