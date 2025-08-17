import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({ origin: true, credentials: true });

  const config = new DocumentBuilder()
    .setTitle('ChatGame API')
    .setDescription('API de jeu de déduction type messagerie')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('docs', app as any, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(3000);
}
bootstrap();
