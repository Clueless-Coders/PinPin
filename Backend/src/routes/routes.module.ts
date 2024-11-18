import { Module } from '@nestjs/common';
import { UserRoutesModule } from './user.routes';
import { AuthRoutesModule } from './auth.routes';

@Module({ imports: [UserRoutesModule, AuthRoutesModule] })
export class RoutesModule {}
