//app.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('INBUCKET_HOSTNAME'),
          port: configService.get('INBUCKET_SMTP_PORT'),
          secure: false, // upgrade later with STARTTLS
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
