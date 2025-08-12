import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.getOrThrow('EMAIL_SMTP_HOST'),
            port: configService.getOrThrow('EMAIL_SMTP_PORT'),
            ignoreTLS:
              configService.getOrThrow('EMAIL_IGNORE_TLS') === '1'
                ? true
                : false,
            secure:
              configService.getOrThrow('EMAIL_SECURE') === '1' ? true : false,
          },
          defaults: {
            from: configService.getOrThrow('EMAIL_FROM'),
            replyTo: configService.getOrThrow('EMAIL_REPLY_TO'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
