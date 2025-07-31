import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { DuplicateEntityException, KnownError } from 'src/errors/errors';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  static handlePrismaError(e: any, entityName: string, entityKey: string) {
    console.error(e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new DuplicateEntityException(
          e.meta?.target as string[] | undefined,
          (e.meta?.entityName as string) ?? entityName,
        );
      }

      if (e.code === 'P2003') {
        throw new KnownError(
          `A(n) ${entityName} entity with key ${entityKey} not found`,
        );
      }
    } else if (e instanceof PrismaClientUnknownRequestError) {
      throw new KnownError('Unknown database error');
    }
    throw new KnownError('Unknown error');
  }
}
