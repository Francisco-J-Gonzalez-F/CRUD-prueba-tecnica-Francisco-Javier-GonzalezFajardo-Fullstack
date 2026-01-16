import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Expense } from './entities/expense.entity';
import { ExpenseSeed } from './expense.seed';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    UsersModule, 
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpenseSeed],
})
export class ExpensesModule {}