import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Expense } from './entities/expense.entity';

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('expenses')
export class ExpensesController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/all')
  adminAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.expensesService.findAllAdmin(Number(page), Number(limit));
  }
  constructor(private readonly expensesService: ExpensesService) {}

  //Buscar por texto (solo del usuario)
  @ApiOperation({ summary: 'Buscar gastos por texto (solo del usuario)' })
  @ApiQuery({ name: 'query', required: false, example: 'comida' })
  @ApiResponse({ status: 200, description: 'Resultados de la búsqueda' })
  @Get('search')
  search(
    @CurrentUser() user: { id: number; role: 'admin' | 'user' },
    @Query('query') query: string,
  ) {
    if (!query) return [];
    return this.expensesService.searchForUser(user, query);
  }

  //Filtrar por categoría (paginado) (solo del usuario)
  @ApiOperation({
    summary: 'Filtrar gastos por categoría con paginación (solo del usuario)',
  })
  @ApiQuery({ name: 'category', required: true, example: 'Transporte' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Gastos filtrados por categoría' })
  @Get('category')
  filterByCategory(
    @CurrentUser() user: { id: number; role: 'admin' | 'user' },
    @Query('category') category: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.expensesService.filterByCategoryForUser(
      user,
      category,
      Number(page),
      Number(limit),
    );
  }

  //Listado general (paginado)
  @ApiOperation({
    summary: 'Obtener todos los gastos (paginados) (solo del usuario)',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado de gastos' })
  @Get()
findAll(
  @CurrentUser() user: { id: number; role: 'admin' | 'user' },
  @Query('page') page = '1',
  @Query('limit') limit = '10',
  @Query('category') category?: string,
  @Query('query') query?: string,
) {
  return this.expensesService.findAllAdmin(
    Number(page),
    Number(limit),
    category,
    query,
  );
}

  //Exportación del usuario 
  @ApiOperation({
    summary: 'Exportar gastos (CSV / Excel / PDF) (solo del usuario)',
  })
  @ApiQuery({ name: 'format', required: false, example: 'csv' })
  @ApiQuery({ name: 'query', required: false, example: 'comida' })
  @ApiQuery({ name: 'category', required: false, example: 'Transporte' })
  @ApiResponse({ status: 200, description: 'Archivo exportado correctamente' })
  @Get('export')
  async exportExpenses(
    @CurrentUser() user: { id: number; role: 'admin' | 'user' },
    @Query('format') format: 'csv' | 'xlsx' | 'pdf' = 'csv',
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Res({ passthrough: false }) res?: Response,
  ) {
    if (!res) return;

    //Traer datos según filtros
    let expenses: Expense[] = [];

    if (query) {
      expenses = await this.expensesService.searchForUser(user, query);
    } else if (category) {
      expenses = await this.expensesService.filterByCategoryNoPaginationForUser(
        user,
        category,
      );
    } else {
      expenses = await this.expensesService.findAllNoPaginationForUser(user);
    }

    const stamp = new Date().toISOString().slice(0, 10);
    const baseName = `gastos_${stamp}`;

    const response = res;

    //Generar archivo según formato
    if (format === 'csv') {
      const file = this.expensesService.exportCsv(expenses);
      response.setHeader('Content-Type', 'text/csv; charset=utf-8');
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${baseName}.csv"`,
      );
      return response.send(file);
    }

    if (format === 'xlsx') {
      const file = await this.expensesService.exportXlsx(expenses);
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${baseName}.xlsx"`,
      );
      return response.send(file);
    }

    // pdf
    const file = await this.expensesService.exportPdf(expenses);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${baseName}.pdf"`,
    );
    return response.send(file);
  }
  //Obtener por ID admin
  @ApiOperation({ summary: 'Obtener un gasto por ID (dueño o admin)' })
  @ApiResponse({ status: 200, description: 'Gasto encontrado' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  @Get(':id')
  findOne(
    @CurrentUser() user: { id: number; role: 'admin' | 'user' },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.expensesService.findOneForUser(user, id);
  }

  //Crear, gasto queda ligado al usuario
  @ApiOperation({ summary: 'Crear un nuevo gasto (del usuario)' })
  @ApiResponse({ status: 201, description: 'Gasto creado correctamente' })
  @Post()
create(
  @CurrentUser() user: any,
  @Body() dto: any,
) {
  console.log('DTO RECIBIDO:', dto)
  return this.expensesService.createForUser(user, dto)
}
  //Actualizar (admin)
  @ApiOperation({ summary: 'Actualizar un gasto existente (dueño o admin)' })
  @ApiResponse({ status: 200, description: 'Gasto actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  @Put(':id')
  update(
    @CurrentUser() user: { id: number; role: 'admin' | 'user' },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateForUser(user, id, dto);
  }

  //Eliminar (admin)
  @ApiOperation({ summary: 'Eliminar un gasto (dueño o admin)' })
  @ApiResponse({ status: 200, description: 'Gasto eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  @Delete(':id')
  remove(
    @CurrentUser() user: { id: number; role: 'admin' | 'user' },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.expensesService.removeForUser(user, id);
  }
}
