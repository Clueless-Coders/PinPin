import { Module } from '@nestjs/common';
import { RouterModule, RouteTree } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';

const userRoutes: RouteTree[] = [
  {
    path: 'user',
    module: UsersModule,
  },
];

@Module({ imports: [RouterModule.register(userRoutes)] })
export class UserRoutesModule {}
