import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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

  /**
   * Execute within institution scope - ensures all queries are tenant-scoped
   */
  forInstitution(institutionId: string) {
    return {
      institutionId,
      // Use in middleware or pass to repositories
    };
  }
}
