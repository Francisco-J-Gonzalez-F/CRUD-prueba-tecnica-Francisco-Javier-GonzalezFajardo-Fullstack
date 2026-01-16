import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('Expenses (e2e)', () => {
  let app: INestApplication;
  let server: Parameters<typeof request>[0];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    // ✅ IMPORTANTE: mismo prefijo que en main.ts
    app.setGlobalPrefix('api');

    await app.init();

    server = app.getHttpServer() as unknown as Parameters<typeof request>[0];
  });

  it('GET /api/expenses responde 200', async () => {
    await request(server).get('/api/expenses?page=1&limit=10').expect(200);
  });

  it('POST /api/expenses crea un gasto y devuelve 201', async () => {
    const payload = {
      description: 'Prueba e2e',
      amount: 123,
      category: 'Test',
    };

    await request(server).post('/api/expenses').send(payload).expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
