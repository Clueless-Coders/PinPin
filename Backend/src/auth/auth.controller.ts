import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(@Body() { email, password }: AuthDTO) {
    return await this.authService.signin(email, password);
  }
}
