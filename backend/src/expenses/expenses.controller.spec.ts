import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

describe('ExpensesService', () => {
  let service: ExpensesService;

  // Mock del query builder (encadenable)
  const qbMock = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  // Mock del repositorio TypeORM
  const repoMock: Partial<jest.Mocked<Repository<Expense>>> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => qbMock as any),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: getRepositoryToken(Expense), useValue: repoMock },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);

    jest.clearAllMocks();
  });

  it('service debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('createForUser: debe crear y guardar un gasto con user', async () => {
    const user = { id: 99, role: 'user' as const };

    const dto: CreateExpenseDto = {
      description: 'Comida',
      amount: 100,
      category: 'Food',
    };

    const createdEntity = {
      ...dto,
      user: { id: user.id },
    } as any;

    const savedEntity = {
      id: 1,
      description: dto.description,
      amount: dto.amount,
      category: dto.category,
      date: new Date(),
      user: { id: user.id },
      userId: user.id,
    } as Expense;

    (repoMock.create as jest.Mock).mockReturnValue(createdEntity);
    (repoMock.save as jest.Mock).mockResolvedValue(savedEntity);

    const result = await service.createForUser(user, dto);

    expect(repoMock.create).toHaveBeenCalledWith({
      ...dto,
      user: { id: user.id },
    });
    expect(repoMock.save).toHaveBeenCalledWith(createdEntity);
    expect(result).toEqual(savedEntity);
    expect(result.date).toBeInstanceOf(Date);
  });

  it('findAllAdmin: debe aplicar paginación y ordenar por date DESC', async () => {
    (qbMock.getManyAndCount as jest.Mock).mockResolvedValue([
      [{ id: 1 } as Expense],
      1,
    ]);

    const result = await service.findAllAdmin(2, 10);

    // skip = (page-1)*limit = (2-1)*10 = 10
    expect(repoMock.createQueryBuilder).toHaveBeenCalledWith('e');
    expect(qbMock.orderBy).toHaveBeenCalledWith('e.date', 'DESC');
    expect(qbMock.skip).toHaveBeenCalledWith(10);
    expect(qbMock.take).toHaveBeenCalledWith(10);

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('filterByCategoryForUser: debe filtrar por categoría y paginar', async () => {
    const user = { id: 10, role: 'user' as const };

    (repoMock.find as jest.Mock).mockResolvedValue([
      { id: 1, category: 'Transport' } as Expense,
    ]);

    const result = await service.filterByCategoryForUser(
      user,
      'Transport',
      1,
      5,
    );

    expect(repoMock.find).toHaveBeenCalledWith({
      where: { user: { id: user.id }, category: 'Transport' },
      skip: 0,
      take: 5,
      order: { date: 'DESC' },
    });

    expect(result[0].category).toBe('Transport');
  });

  it('searchForUser: debe buscar por description y ordenar', async () => {
    const user = { id: 10, role: 'user' as const };

    (repoMock.find as jest.Mock).mockResolvedValue([
      { id: 1, description: 'Pizza' } as Expense,
    ]);

    const result = await service.searchForUser(user, 'Piz');

    // No comparamos ILike exacto (es un objeto interno), pero sí la estructura
    expect(repoMock.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          user: { id: user.id },
          description: expect.anything(),
        }),
        order: { date: 'DESC' },
      }),
    );

    expect(result[0].description).toContain('Pizza');
  });

  it('findOneForUser: si no existe, lanza NotFoundException', async () => {
    const user = { id: 10, role: 'user' as const };

    (repoMock.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.findOneForUser(user, 999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updateForUser: debe actualizar y guardar', async () => {
    const user = { id: 10, role: 'user' as const };

    const existing = {
      id: 1,
      description: 'Old',
      amount: 10,
      category: 'Food',
      date: new Date(),
      user: { id: user.id },
      userId: user.id,
    } as Expense;

    (repoMock.findOne as jest.Mock).mockResolvedValue(existing);

    const dto: UpdateExpenseDto = { description: 'New' };

    (repoMock.save as jest.Mock).mockResolvedValue({
      ...existing,
      description: 'New',
    } as Expense);

    const result = await service.updateForUser(user, 1, dto);

    expect(repoMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'New' }),
    );
    expect(result.description).toBe('New');
  });

  it('removeForUser: debe eliminar y regresar mensaje', async () => {
    const user = { id: 10, role: 'user' as const };

    const existing = {
      id: 1,
      user: { id: user.id },
      userId: user.id,
    } as Expense;

    (repoMock.findOne as jest.Mock).mockResolvedValue(existing);
    (repoMock.remove as jest.Mock).mockResolvedValue(existing);

    const result = await service.removeForUser(user, 1);

    expect(repoMock.remove).toHaveBeenCalledWith(existing);
    expect(result).toEqual({ message: 'Expense deleted successfully' });
  });
});
