import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RoutesModule } from './routes/routes.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RoutesModule, UsersModule, PrismaModule, AuthModule],
})
export class AppModule {}
