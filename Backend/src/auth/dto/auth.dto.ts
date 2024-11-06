import { IsEmail, IsString } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
