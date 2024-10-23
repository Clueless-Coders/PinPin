import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class UserBaseDTO {
  @IsString()
  @IsEmail()
  @Expose()
  email: string;
}

export class UserCreateDTO extends UserBaseDTO {
  @IsString()
  password: string;
}
