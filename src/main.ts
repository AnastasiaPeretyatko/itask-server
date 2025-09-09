import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function start() {
  const PORT = process.env.PORT || 7000;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('').setDescription('').setVersion('1.0.0').addTag('').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,POST,PUT,PATCH,DELETE', // Разрешенные методы
    credentials: true, // Если используете куки или авторизацию
  });

  await app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
}

start();
