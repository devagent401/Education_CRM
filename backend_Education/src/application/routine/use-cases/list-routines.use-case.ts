import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface RoutineFilters {
  classId?: string;
  teacherId?: string;
  dayOfWeek?: number;
  academicYear?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ListRoutinesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(institutionId: string, filters: RoutineFilters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { institutionId, deletedAt: null };
    if (filters.classId) where.classId = filters.classId;
    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.dayOfWeek !== undefined) where.dayOfWeek = filters.dayOfWeek;
    if (filters.academicYear) where.academicYear = filters.academicYear;

    const [rows, total] = await Promise.all([
      this.prisma.classRoutine.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        include: { teacherProfile: { include: { user: true } } },
      }),
      this.prisma.classRoutine.count({ where }),
    ]);

    return {
      data: rows.map((r) => ({
        id: r.id,
        classId: r.classId,
        subjectName: r.subjectName,
        subjectId: r.subjectId ?? undefined,
        teacherId: r.teacherId,
        teacherName: r.teacherProfile?.user?.name,
        dayOfWeek: r.dayOfWeek,
        startTime: r.startTime,
        endTime: r.endTime,
        room: r.room ?? undefined,
        academicYear: r.academicYear ?? undefined,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
