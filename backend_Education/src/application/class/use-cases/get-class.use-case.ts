import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class GetClassUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string) {
    const row = await this.prisma.academicStructure.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Class not found');
    return {
      id: row.id,
      name: row.name,
      code: row.code,
      level: row.level,
      parentId: row.parentId ?? undefined,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
      metadata: row.metadata,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
