import { NestContainer, NestFactory } from '@nestjs/core';
import { NestFactoryStatic } from '@nestjs/core/nest-factory';
import { AppModule } from 'src/app.module';

describe('POST /pin/:id/upvote', () => {
  beforeEach(async () => {
    const app = await NestFactory.create(AppModule);
  });
});
