import { Module } from '@nestjs/common';
import { RouterModule, RouteTree } from '@nestjs/core';
import path from 'path';
import { AuthModule } from 'src/auth/auth.module';
import { PinsModule } from 'src/pins/pins.module';

const pinRoutes: RouteTree[] = [
    {
      path: 'pin',
      module: PinsModule,
    },
  ];
  
  @Module({ imports: [RouterModule.register(pinRoutes)] })
  export class PinsRoutesModule {}