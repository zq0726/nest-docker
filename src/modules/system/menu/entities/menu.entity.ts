import { DateType } from '@/config/constant';
import * as dayjs from 'dayjs';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MenuType {
  DIR = 1,
  MENU = 2,
  BUTTON = 3,
}

const DEFAULT_MENU_CONFIG = {
  IS_ROUTE: true,
  HIDDEN_ROUTE: false,
  CACHE_ROUTE: false,
  ORDER: 1,
};

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MenuType,
    comment: '菜单类型(1:目录 2:菜单 3:按钮)',
  })
  type: MenuType;

  @Column({ type: 'varchar', comment: '菜单名称', nullable: true })
  menuName: string;

  @Column({ type: 'varchar', comment: '按钮权限', nullable: true })
  btnPermission: string;

  @Column({ type: 'varchar', comment: '路径', unique: true })
  path: string;

  @Column({ type: 'varchar', comment: '组件', nullable: true })
  component: string;

  @Column({ type: 'int', comment: '父级菜单', nullable: true })
  @Index('IDX_FATHER_MENU') // 添加索引
  father: number;

  @Column({ type: 'varchar', comment: '默认跳转地址', nullable: true })
  defaultDirection: string;

  @Column({ type: 'int', comment: '排序', default: DEFAULT_MENU_CONFIG.ORDER })
  order: number;

  @Column({ comment: '图标', nullable: true })
  icon: string;

  @Column({ comment: '是否是路由', default: DEFAULT_MENU_CONFIG.IS_ROUTE })
  isRoute: boolean;

  @Column({
    comment: '是否隐藏路由',
    default: DEFAULT_MENU_CONFIG.HIDDEN_ROUTE,
  })
  hiddenRoute: boolean;

  @Column({ comment: '是否缓存路由', default: DEFAULT_MENU_CONFIG.CACHE_ROUTE })
  cacheRoute: boolean;

  @Column({ comment: '授权标识', nullable: true })
  authorizeCode: string;

  @CreateDateColumn({
    transformer: {
      to: (value) => value,
      from: (value) => dayjs(value).format(DateType),
    },
    comment: '创建时间',
  })
  createAt: Date;

  @UpdateDateColumn({
    transformer: {
      to: (value) => value,
      from: (value) => dayjs(value).format(DateType),
    },
    comment: '更新时间',
  })
  updateAt: Date;
}
