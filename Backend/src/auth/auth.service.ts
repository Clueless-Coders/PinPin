import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Check a username and password combination for login. Returns
   * a JWT token for authenticated endpoints.
   * @param username
   * @param password
   */
  async signin(email: string, password: string) {
    let user: User | undefined;

    //Search for user in db
    try {
      user = await this.usersService.getUserByEmail(email);
    } catch (e: any) {
      console.log(e);
      throw new UnauthorizedException('User not found.');
    }

    //Check pw
    //TODO: Implement encryption here.
    if (user.pwHash !== password)
      throw new UnauthorizedException('Password Incorrect.');

    //Return the JWT upon successful authentication
    return {
      access_token: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      }),
    };
  }
}