import { DateType } from '@/config/constant';
import * as dayjs from 'dayjs';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '部门名称' })
  departmentName: string;

  @Column({ type: 'int', comment: '部门主管' })
  director: number;

  @Column({ type: 'varchar', comment: '创建人' })
  createBy: string;

  @Column({ type: 'varchar', comment: '备注', nullable: true })
  remark: string;

  @CreateDateColumn({
    transformer: {
      to: (value) => value,
      from: (value) => dayjs(value).format(DateType),
    },
  })
  createAt: Date;

  @UpdateDateColumn({
    transformer: {
      to: (value) => value,
      from: (value) => dayjs(value).format(DateType),
    },
  })
  updateAt: Date;
}
