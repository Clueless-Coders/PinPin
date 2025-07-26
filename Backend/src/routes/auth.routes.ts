import { Module } from '@nestjs/common';
import { RouterModule, RouteTree } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';

const authRoutes: RouteTree[] = [
  {
    path: 'auth',
    module: AuthModule,
  },
];

@Module({ imports: [RouterModule.register(authRoutes)] })
export class AuthRoutesModule {}
