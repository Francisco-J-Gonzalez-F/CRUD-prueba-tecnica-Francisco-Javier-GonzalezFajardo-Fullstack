import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from 'src/expenses/entities/expense.entity';
import { ExpenseReportQueryDto } from 'src/reports/dto/expense-report-query.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  async byCategory(q: ExpenseReportQueryDto) {
    const qb = this.expenseRepo
      .createQueryBuilder('e')
      .select('e.category', 'category')
      .addSelect('SUM(e.amount)', 'total')
      .where('e.date >= :from AND e.date < :to', {
        from: new Date(q.from),
        to: new Date(q.to),
      });

    if (q.category)
      qb.andWhere('e.category = :category', { category: q.category });

    const rows = await qb
      .groupBy('e.category')
      .orderBy('total', 'DESC')
      .getRawMany<{ category: string; total: string }>();

    return rows.map((r) => ({ category: r.category, total: Number(r.total) }));
  }

  async byPeriod(q: ExpenseReportQueryDto) {
    const group = q.group ?? 'month';
    const trunc = group === 'day' ? 'day' : 'month';

    const qb = this.expenseRepo
      .createQueryBuilder('e')
      .select(`date_trunc('${trunc}', e.date)`, 'period')
      .addSelect('SUM(e.amount)', 'total')
      .where('e.date >= :from AND e.date < :to', {
        from: new Date(q.from),
        to: new Date(q.to),
      });

    if (q.category)
      qb.andWhere('e.category = :category', { category: q.category });

    const rows = await qb
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany<{ period: string; total: string }>();

    return rows.map((r) => ({ period: r.period, total: Number(r.total) }));
  }
}
