import { Exclude } from 'class-transformer';
import * as dayjs from 'dayjs';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '账号' })
  account: string;

  @Exclude({ toPlainOnly: true }) // 序列化时自动排除
  @Column({ type: 'varchar', comment: '密码', select: false })
  password: string;

  @Column({ type: 'varchar', comment: '昵称', default: '' })
  username: string;

  @Column({ type: 'varchar', comment: '手机号', default: '' })
  phone: string;

  @Column({ nullable: true })
  avatar: string; //头像

  @Column({ nullable: true })
  email: string; //邮箱

  @Column({ nullable: true })
  role: string; //角色

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({
    transformer: {
      to: (value) => value,
      from: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    },
  })
  createAt: Date;

  @UpdateDateColumn({
    transformer: {
      to: (value) => value,
      from: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    },
  })
  updateAt: Date;
}
