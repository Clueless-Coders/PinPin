import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/guards/public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(
    @Body() { email, password }: AuthDTO,
  ): Promise<{ access_token: string }> {
    return await this.authService.signin(email, password);
  }
}
