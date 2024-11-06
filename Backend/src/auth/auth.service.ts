import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Check a username and password combination for login. Returns
   * a JWT token for authenticated endpoints.
   * @param username
   * @param password
   */
  async signin(email: string, password: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      return user.pwHash === password;
    } catch (e: any) {
      console.log(e);
      throw new UnauthorizedException('User not found.');
    }
  }
}
