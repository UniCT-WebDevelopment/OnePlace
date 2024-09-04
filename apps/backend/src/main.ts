import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
      preflightContinue: false,
      credentials: true,
    });
    const options = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
    
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  } else {
    app.enableCors({
      origin: 'https://oneplace.lol',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
      preflightContinue: false,
      credentials: true,
    });
  }
  
  await app.listen(3001);
}
bootstrap();