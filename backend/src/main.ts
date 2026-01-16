import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { RequestHandler } from 'express';

import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cookieParserMw: RequestHandler = cookieParser();
  app.use(cookieParserMw);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    httpOnly: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Expenses API')
    .setDescription('API para gestión de gastos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
