import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

/** 基础entity */
export abstract class BaseEntity {
  /** 主键 */
  @PrimaryGeneratedColumn({ comment: '主键' })
  @ApiProperty()
  id: number;

  /** 创建人 */
  @ManyToOne(() => User, { nullable: true })
  @ApiProperty({ type: () => User })
  @JoinColumn()
  creator: User;

  /** 修改人 */
  @ManyToOne(() => User, { nullable: true })
  @ApiProperty({ type: () => User })
  @JoinColumn()
  editor: User;

  /** 创建时间 */
  @CreateDateColumn({ comment: '创建时间' })
  @ApiProperty()
  createdAt: Date;

  /** 更新时间 */
  @UpdateDateColumn({ comment: '更新时间' })
  @ApiProperty()
  updatedAt: Date;

  @Column({ comment: '是否删除', nullable: false, default: 0 })
  @ApiProperty()
  deleted: boolean;
}
