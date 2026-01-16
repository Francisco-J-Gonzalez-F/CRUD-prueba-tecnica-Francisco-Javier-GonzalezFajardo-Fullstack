import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Expense } from '../../expenses/entities/expense.entity';

export type UserRole = 'admin' | 'user';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column('text', {select: false })
  passwordHash: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];
}
