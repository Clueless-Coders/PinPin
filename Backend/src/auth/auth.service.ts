import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

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
    const pwValid = await bcrypt.compare(password, user.pwHash);

    if (!pwValid) throw new UnauthorizedException('Password Incorrect.');

    //Generate tokens
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      }),
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: '7d',
        },
      ),
    ]);

    //Return the JWT upon successful authentication
    return {
      access_token,
      refresh_token,
    };
  }
}
