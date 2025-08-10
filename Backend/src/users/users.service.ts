import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommentVote, PinVote, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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
      PrismaService.handlePrismaError(e, 'User', 'email: ' + email);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.primsaService.user.findFirstOrThrow({
        where: {
          email,
        },
      });
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'User', 'email: ' + email);
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      return await this.primsaService.user.findFirstOrThrow({
        where: {
          id,
        },
      });
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'User', 'userId: ' + id);
    }
  }

  async getPinVotes(id: number): Promise<PinVote[]> {
    try {
      return await this.primsaService.pinVote.findMany({
        where: {
          userId: id,
        },
      });
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Upvote', 'userId: ' + id);
    }
  }

  async getPinVoteById(userId: number, pinId: number): Promise<PinVote | null> {
    try {
      return await this.primsaService.pinVote.findUnique({
        where: {
          userId_pinId: {
            userId,
            pinId,
          },
        },
      });
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Upvote', 'userId: ' + userId);
    }
  }

  async getCommentVotes(id: number): Promise<CommentVote[]> {
    try {
      return await this.primsaService.commentVote.findMany({
        where: {
          userId: id,
        },
      });
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Upvote', 'userId: ' + id);
    }
  }

  async getCommentVoteById(
    userId: number,
    commentId: number,
  ): Promise<CommentVote | null> {
    try {
      return await this.primsaService.commentVote.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Upvote', 'userId: ' + userId);
    }
  }
}
