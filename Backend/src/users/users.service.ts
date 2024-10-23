import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly primsaService: PrismaService) {}

  async createUser(email: string, password: string): Promise<User> {
    try {
      const res = await this.primsaService.user.create({
        data: { email: email, pwHash: password },
      });
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.primsaService.user.findFirstOrThrow({
      where: {
        email,
      },
    });
  }
  async getUserById(id: number): Promise<User> {
    return await this.primsaService.user.findFirstOrThrow({
      where: {
        id,
      },
    });
  }
}
