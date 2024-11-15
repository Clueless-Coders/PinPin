import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class UserBaseDTO {
  @IsEmail()
  @Expose()
  email: string;
}

export class UserCreateDTO {
  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @Exclude()
  password: string;
}
