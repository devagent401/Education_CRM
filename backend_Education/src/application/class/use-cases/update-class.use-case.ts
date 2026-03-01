import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class UpdateClassUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, data: { name?: string; code?: string; level?: number; parentId?: string; sortOrder?: number; isActive?: boolean }) {
    const existing = await this.prisma.academicStructure.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Class not found');

    const row = await this.prisma.academicStructure.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.code && { code: data.code }),
        ...(data.level !== undefined && { level: data.level }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
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
