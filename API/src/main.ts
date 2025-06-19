import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set secure HTTP headers
  app.use(helmet());

  // Global input validation and sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw error on non-whitelisted properties
      transform: true, // Transform payloads to DTO instances
    }),
  );

  // Enable CORS with strict configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173', // Set allowed origin(s)
    methods: 'GET,HEAD,POST,PUT,DELETE',
    credentials: true,
  });

  // Hide stack traces in production
  app.useGlobalFilters({
    catch(exception, host) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = exception.getStatus ? exception.getStatus() : 500;
      const message =
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : exception.message ?? 'Internal server error';
      response.status(status).json({ statusCode: status, message });
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Social Network API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
