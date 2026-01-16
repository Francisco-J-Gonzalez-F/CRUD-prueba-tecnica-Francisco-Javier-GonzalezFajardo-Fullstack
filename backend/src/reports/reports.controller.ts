import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ExpenseReportQueryDto } from './dto/expense-report-query.dto';

@ApiTags('reports')
@Controller('reports/expenses')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Reporte: total por categoría (pastel)' })
  @Get('by-category')
  byCategory(@Query() q: ExpenseReportQueryDto) {
    return this.reportsService.byCategory(q);
  }

  @ApiOperation({ summary: 'Reporte: total por periodo (day|month)' })
  @ApiQuery({ name: 'group', required: false, example: 'month' })
  @Get('by-period')
  byPeriod(@Query() q: ExpenseReportQueryDto) {
    return this.reportsService.byPeriod(q);
  }
}
