import {
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ExpenseReportQueryDto {
  @IsISO8601()
  from!: string; 

  @IsISO8601()
  to!: string;

  @IsOptional()
  @IsIn(['day', 'month'])
  group?: 'day' | 'month' = 'month';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
