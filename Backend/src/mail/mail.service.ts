import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class MailService implements OnModuleInit {
  constructor(private readonly mailerService: MailerService) {}

  async onModuleInit() {
    console.log('hello');
    const test = await this.mailerService.sendMail({
      to: 'test@pinpinapp.com',
      from: 'auth@pinpinapp.com',
      subject: 'Test!',
      text: 'hello :)',
      html: '<p>hello!</p>',
    });
    console.log(test);
  }
}
