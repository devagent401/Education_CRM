import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './presentation/common/filters/http-exception.filter';
import { LoggingInterceptor } from './presentation/common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra fields from the request body
      forbidNonWhitelisted: true, // throw an error if extra fields are sent
      transform: true, // transform the request body to the DTO-(data trasnform Object) types
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Educational Institution Management API')
    .setDescription(
      'Multi-tenant SaaS API for educational institutions.\n\n' +
      '**Authentication:** Use Bearer token from `/auth/login` for protected endpoints.\n\n' +
      '**Institution context:** Attendance endpoints require `x-institution-id` header.',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local')
    .addBearerAuth()
    .addApiKey(
      { name: 'x-institution-id', in: 'header', type: 'apiKey' },
      'institution-id',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
