import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/guards/public.decorator';
import { Refresh } from 'src/guards/refresh.decorator';
import { Request } from 'express';

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

  @Refresh()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  //If the refresh token is valid, should have the user inside the request
  async refresh(@Req() request: Request) {
    return await this.authService.refresh(request['user']);
  }
}
