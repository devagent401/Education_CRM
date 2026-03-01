import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class ListFeeStructuresUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(institutionId: string, filters: { classId?: string; academicYear?: string; page?: number; limit?: number }) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { institutionId, deletedAt: null };
    if (filters.classId) where.classId = filters.classId;
    if (filters.academicYear) where.academicYear = filters.academicYear;

    const [rows, total] = await Promise.all([
      this.prisma.feeStructure.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.feeStructure.count({ where }),
    ]);

    return {
      data: rows.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        amount: Number(r.amount),
        feeType: r.feeType,
        classId: r.classId ?? undefined,
        academicYear: r.academicYear ?? undefined,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
