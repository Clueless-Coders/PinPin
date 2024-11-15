import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserBaseDTO, UserCreateDTO } from './dto/user.dto';
import { Public } from 'src/guards/public.decorator';
import { Request } from 'express';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/email')
  async getUserByEmail(@Body() { email }: UserBaseDTO) {
    return await this.usersService.getUserByEmail(email);
  }

  @Get('/me')
  async getCurrentUser(@Req() req: Request) {
    return await this.usersService.getUserById(req['user'].id);
  }

  @Get('/:id')
  async getUserById(@Param() { id }: { id: string }) {
    return await this.usersService.getUserById(+id);
  }

  @Public()
  @Post()
  async createUser(@Body() user: UserCreateDTO) {
    return await this.usersService.createUser(user.email, user.password);
  }
}
