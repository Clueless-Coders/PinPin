import { Module } from '@nestjs/common';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PinsController],
  providers: [PinsService]
})
export class PinsModule {}
