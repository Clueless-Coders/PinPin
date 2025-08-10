import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RoutesModule } from './routes/routes.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PinsModule } from './pins/pins.module';
import { MailModule } from './mail/mail.module';
import { RequestLoggerMiddleware } from './interceptors/request-logger.interceptor';

@Module({
  imports: [
    RoutesModule,
    UsersModule,
    PinsModule,
    PrismaModule,
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
