import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserBaseDTO, UserCreateDTO } from './dto/user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/email')
  async getUserByEmail(@Body() { email }: UserBaseDTO) {
    return await this.usersService.getUserByEmail(email);
  }

  @Get('/:id')
  async getUserById(@Param() { id }: { id: string }) {
    console.log(id);
    return await this.usersService.getUserById(+id);
  }

  @Post()
  async createUser(@Body() { email, password }: UserCreateDTO) {
    console.log(email, password);
    return await this.usersService.createUser(email, password);
  }
}
