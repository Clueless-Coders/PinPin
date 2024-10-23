import { Module } from '@nestjs/common';
import { UserRoutesModule } from './user.routes';

@Module({ imports: [UserRoutesModule] })
export class RoutesModule {}
