import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

/** 角色entity */
@Entity({ name: 'Role' })
export class Role extends BaseEntity {
  /** 名称 */
  @Column({ comment: '名称', length: 50, nullable: false, unique: true })
  @ApiProperty()
  name: string;

  /** 权限 */
  @Column({ comment: '权限', type: 'text', nullable: true })
  @ApiProperty()
  permission: string;

  /** 备注 */
  @Column({ comment: '备注', type: 'text', nullable: true })
  @ApiProperty()
  remark: string;
}
