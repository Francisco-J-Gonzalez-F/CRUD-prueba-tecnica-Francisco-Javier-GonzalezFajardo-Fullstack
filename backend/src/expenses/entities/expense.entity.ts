import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  RelationId,
} from 'typeorm';
import { User } from 'src/users/entities/user.entities';


@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  description: string;

  @Column('numeric', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @Column({ length: 50 })
  category: string;

  @Index()
  @ManyToOne(() => User, (user) => user.expenses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @RelationId((expense: Expense) => expense.user)
  userId: number;
}
