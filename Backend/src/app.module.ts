import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PinsModule } from './pins/pins.module';

@Module({
  imports: [UsersModule, PinsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
