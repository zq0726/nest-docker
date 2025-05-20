import { Exclude } from 'class-transformer';
import * as dayjs from 'dayjs';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '账号' })
  account: string;

  @Exclude({ toPlainOnly: true }) // 序列化时自动排除
  @Column({ type: 'varchar', comment: '密码', select: false })
  password: string;

  @Column({ type: 'varchar', comment: '真实名字', default: '' })
  username: string;

  @Column({ type: 'varchar', comment: '手机号', default: '' })
  phone: string;

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
