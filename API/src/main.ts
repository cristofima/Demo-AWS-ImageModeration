import { loadConfig } from './config';
loadConfig();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

const environment = process.env.NODE_ENV ?? 'local';
dotenv.config({ path: `.env.${environment}` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Social Media')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
