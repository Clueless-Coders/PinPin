import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserCreateDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly primsaService: PrismaService) {}

  async createUser(email: string, password: string): Promise<User> {
    //Encrypt password with 10 rounds of salting
    const hash = await bcrypt.hash(password, 10);

    try {
      const res = await this.primsaService.user.create({
        data: { email: email, pwHash: hash },
      });

      return { ...res, pwHash: undefined };
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
