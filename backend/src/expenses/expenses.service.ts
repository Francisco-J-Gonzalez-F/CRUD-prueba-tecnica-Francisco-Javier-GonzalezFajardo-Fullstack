import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

import { Parser as Json2CsvParser } from 'json2csv';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

type ReqUser = { id: number; role: 'admin' | 'user' };

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}


  // Helpers de permisos
  private isAdmin(user: ReqUser) {
    return user.role === 'admin';
  }

  private async getExpenseWithUser(id: number) {
    const exp = await this.expenseRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!exp) throw new NotFoundException(`Expense with ID ${id} not found`);
    return exp;
  }

  private assertOwnerOrAdmin(user: ReqUser, expense: Expense) {
    const ownerId = (expense as any).user?.id;
    const isAdmin = user.role === 'admin';
    if (!isAdmin && ownerId !== user.id) {
      throw new ForbiddenException('No permitido');
    }
  }
  // CRUD (con usuario)
   async createForUser(user: ReqUser, dto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...dto,
      user: { id: user.id } as any,
    });
    return this.expenseRepository.save(expense);
  }
  async findAllAdmin(page = 1, limit = 10, category?: string, query?: string) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));

    const qb = this.expenseRepository.createQueryBuilder('e');

    if (category) {
      qb.andWhere('e.category = :category', { category });
    }

    if (query) {
      qb.andWhere('LOWER(e.description) LIKE :q', {
        q: `%${query.toLowerCase()}%`,
      });
    }

    qb.orderBy('e.date', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }

  async findAllForUser(
    user: ReqUser,
    page = 1,
    limit = 10,
  ): Promise<Expense[]> {
    const where = { user: { id: user.id } };

    return this.expenseRepository.find({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });
  }

  async filterByCategoryForUser(
    user: ReqUser,
    category: string,
    page = 1,
    limit = 10,
  ): Promise<Expense[]> {
    const where = { user: { id: user.id }, category };
    return this.expenseRepository.find({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });
  }

  async searchForUser(user: ReqUser, query: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: { id: user.id }, description: ILike(`%${query}%`) },
      order: { date: 'DESC' },
    });
  }

  async findOneForUser(user: ReqUser, id: number): Promise<Expense> {
    const expense = await this.getExpenseWithUser(id);
    this.assertOwnerOrAdmin(user, expense);
    delete (expense as any).user;
    return expense;
  }

  async updateForUser(
    user: ReqUser,
    id: number,
    dto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.getExpenseWithUser(id);
    this.assertOwnerOrAdmin(user, expense);

    Object.assign(expense, dto);
    const saved = await this.expenseRepository.save(expense);
    delete (saved as any).user;
    return saved;
  }

  async removeForUser(user: ReqUser, id: number): Promise<{ message: string }> {
    const expense = await this.getExpenseWithUser(id);
    this.assertOwnerOrAdmin(user, expense);

    await this.expenseRepository.remove(expense);
    return { message: 'Expense deleted successfully' };
  }

  // Export helpers sin paginación (con usuario)

  async findAllNoPaginationForUser(user: ReqUser): Promise<Expense[]> {
    const where = { user: { id: user.id } };
    return this.expenseRepository.find({
      where,
      order: { date: 'DESC' },
    });
  }

  async filterByCategoryNoPaginationForUser(
    user: ReqUser,
    category: string,
  ): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: { id: user.id }, category },
      order: { date: 'DESC' },
    });
  }

  
  // Export: CSV / XLSX / PDF

  private static readonly CSV_FIELDS = [
    'Fecha',
    'Descripción',
    'Categoría',
    'Monto',
  ] as const;

  private static readonly CsvParserCtor =
    Json2CsvParser as unknown as new (opts: {
      fields: readonly (typeof ExpensesService.CSV_FIELDS)[number][];
    }) => { parse: (rows: CsvRow[]) => string };

  exportCsv(expenses: Expense[]): Buffer {
    const rows: CsvRow[] = expenses.map((e) => ({
      Fecha: this.formatDate(e.date),
      Descripción: e.description ?? '',
      Categoría: e.category ?? '',
      Monto: Number(e.amount) || 0,
    }));

    const parser = new ExpensesService.CsvParserCtor({
      fields: ExpensesService.CSV_FIELDS,
    });

    const csv = parser.parse(rows);
    return Buffer.from(csv, 'utf-8');
  }

  async exportXlsx(expenses: Expense[]): Promise<Buffer> {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Gastos');

    ws.columns = [
      { header: 'Fecha', key: 'date', width: 14 },
      { header: 'Descripción', key: 'description', width: 40 },
      { header: 'Categoría', key: 'category', width: 22 },
      { header: 'Monto', key: 'amount', width: 14 },
    ];

    expenses.forEach((e) => {
      ws.addRow({
        date: this.formatDate(e.date),
        description: e.description ?? '',
        category: e.category ?? '',
        amount: Number(e.amount) || 0,
      });
    });

    ws.getRow(1).font = { bold: true };

    const buf = await wb.xlsx.writeBuffer();
    return Buffer.from(buf);
  }

  private static readonly PdfCtor = PDFDocument as unknown as PdfDocCtor;

  exportPdf(expenses: Expense[]): Promise<Buffer> {
    const doc = new ExpensesService.PdfCtor({ size: 'A4', margin: 40 });
    const chunks: Buffer[] = [];

    doc.on('data', (c) => {
      if (c) chunks.push(c);
    });

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(16).text('Reporte de gastos', { align: 'center' });
      doc.moveDown();

      doc.fontSize(10);
      doc.text('Fecha', 40, doc.y, { continued: true, width: 80 });
      doc.text('Descripción', { continued: true, width: 250 });
      doc.text('Categoría', { continued: true, width: 110 });
      doc.text('Monto', { width: 60, align: 'right' });
      doc.moveDown(0.5);

      let total = 0;

      expenses.forEach((e) => {
        const amount = Number(e.amount) || 0;
        total += amount;

        doc.text(this.formatDate(e.date), 40, doc.y, {
          continued: true,
          width: 80,
        });
        doc.text(e.description ?? '', { continued: true, width: 250 });
        doc.text(e.category ?? '', { continued: true, width: 110 });
        doc.text(String(amount), { width: 60, align: 'right' });
      });

      doc.moveDown();
      doc.fontSize(12).text(`Total: ${total}`, { align: 'right' });

      doc.end();
    });
  }

  // Utils
  private formatDate(dateValue: any): string {
    const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }
}

type CsvRow = {
  Fecha: string;
  Descripción: string;
  Categoría: string;
  Monto: number;
};

type PdfDocLike = {
  on: (event: 'data' | 'end', cb: (chunk?: Buffer) => void) => void;
  fontSize: (size: number) => PdfDocLike;
  text: (...args: any[]) => PdfDocLike;
  moveDown: (lines?: number) => PdfDocLike;
  y: number;
  end: () => void;
};

type PdfDocCtor = new (opts: { size: string; margin: number }) => PdfDocLike;
