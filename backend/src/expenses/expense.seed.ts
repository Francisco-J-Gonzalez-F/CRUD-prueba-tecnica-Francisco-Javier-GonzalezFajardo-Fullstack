import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { UsersService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entities';

@Injectable()
export class ExpenseSeed implements OnModuleInit {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    private readonly usersService: UsersService, 
  ) {}

  async onModuleInit() {
    const count = await this.expenseRepo.count();
    if (count > 0) return;

    const seedEmail = 'seed@demo.com';
    const seedPassword = '123456';

    let user = await this.usersService.findByEmail(seedEmail);
    if (!user) {
      user = await this.usersService.create(seedEmail, seedPassword, 'user');
    }

    const expenses = [
      this.expenseRepo.create({
        description: 'Supermercado',
        amount: 350,
        category: 'Alimentos',
        user, 
      }),
      this.expenseRepo.create({
        description: 'Gasolina',
        amount: 500,
        category: 'Transporte',
        user,
      }),
    ];

    await this.expenseRepo.save(expenses);
  }
}
