import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface TeacherFilters {
  search?: string;
  department?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ListTeachersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(institutionId: string, filters: TeacherFilters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      institutionId,
      deletedAt: null,
      user: { deletedAt: null, role: 'TEACHER' },
    };
    if (filters.department) where.department = filters.department;
    if (filters.search) {
      where.OR = [
        { user: { name: { contains: filters.search, mode: 'insensitive' } } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const [rows, total] = await Promise.all([
      this.prisma.teacherProfile.findMany({
        where,
        skip,
        take: limit,
        include: { user: true },
        orderBy: { user: { name: 'asc' } },
      }),
      this.prisma.teacherProfile.count({ where }),
    ]);

    return {
      data: rows.map((r) => ({
        id: r.id,
        userId: r.userId,
        institutionId: r.institutionId,
        email: r.user.email,
        name: r.user.name,
        phone: r.user.phone ?? undefined,
        employeeId: r.employeeId ?? undefined,
        department: r.department ?? undefined,
        specialization: r.specialization ?? undefined,
        salary: r.salary ? Number(r.salary) : undefined,
        joinDate: r.joinDate ?? undefined,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
