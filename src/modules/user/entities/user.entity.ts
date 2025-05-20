import { Exclude } from 'class-transformer';
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

  @Exclude()
  @Column({ type: 'varchar', comment: '密码' })
  password: string;

  @Column({ type: 'varchar', comment: '真实名字', default: '' })
  username: string;

  @Column({ type: 'varchar', comment: '手机号', default: '' })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
