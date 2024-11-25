import { Module } from '@nestjs/common';
import { UserRoutesModule } from './user.routes';
import { AuthRoutesModule } from './auth.routes';
import { PinsRoutesModule } from './pin.routes';

@Module({ imports: [UserRoutesModule, AuthRoutesModule, PinsRoutesModule] })
export class RoutesModule {}
