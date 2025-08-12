import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestEmail() {
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
