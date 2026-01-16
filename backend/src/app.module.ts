import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpensesModule } from './expenses/expenses.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const host = cfg.get<string>('DB_HOST');
        const port = cfg.get<number>('DB_PORT');
        const username = cfg.get<string>('DB_USERNAME');
        const password = cfg.get<string>('DB_PASSWORD');
        const database = cfg.get<string>('DB_NAME');

        // ✅ log TEMPORAL para confirmar (luego lo quitas)
        console.log('DB_FROM_CONFIG:', { host, port, username, database });

        return {
          type: 'postgres' as const,
          host,
          port: Number(port),
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    UsersModule,
    AuthModule,
    ExpensesModule,
  ],
})
export class AppModule {}
