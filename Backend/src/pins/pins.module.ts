import { Module } from '@nestjs/common';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [PrismaModule, UsersModule, ImagesModule],
  controllers: [PinsController],
  providers: [PinsService],
})
export class PinsModule {}
