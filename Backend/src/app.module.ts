import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RoutesModule } from './routes/routes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [RoutesModule, UsersModule, PrismaModule],
})
export class AppModule {}
