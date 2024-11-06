import { Controller } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(private readonly usersService: UsersService) {}
}
