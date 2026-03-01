import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface ClassFilters {
  level?: number;
  parentId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ListClassesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(institutionId: string, filters: ClassFilters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { institutionId, deletedAt: null };
    if (filters.level !== undefined) where.level = filters.level;
    if (filters.parentId !== undefined) where.parentId = filters.parentId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await Promise.all([
      this.prisma.academicStructure.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.academicStructure.count({ where }),
    ]);

    return {
      data: rows.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        level: r.level,
        parentId: r.parentId ?? undefined,
        sortOrder: r.sortOrder,
        isActive: r.isActive,
        metadata: r.metadata,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
