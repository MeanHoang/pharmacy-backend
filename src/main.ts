import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Server is running on http://localhost:${process.env.PORT}`);
}
bootstrap();
