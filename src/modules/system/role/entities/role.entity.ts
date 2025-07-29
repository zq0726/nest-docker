import { DateType } from '@/config/constant';
import * as dayjs from 'dayjs';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Menu } from '../../menu/entities/menu.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '角色名' })
  roleName: string;

  @Column({ type: 'varchar', comment: '角色编码', nullable: true })
  roleCode: string;

  @Column({ type: 'varchar', comment: '备注', nullable: true })
  remark: string;

  @Column({ type: 'varchar', comment: 'power', nullable: true })
  rolePower: string;

  @Column({ default: '', comment: '创建人' })
  createBy: string;

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

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'role_menu',
    joinColumn: { name: 'roleId' },
    inverseJoinColumn: { name: 'menuId' },
  })
  menus: Menu[];
}
