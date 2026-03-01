import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class GetRoutineUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string) {
    const row = await this.prisma.classRoutine.findFirst({
      where: { id, deletedAt: null },
      include: { teacherProfile: { include: { user: true } } },
    });
    if (!row) throw new NotFoundException('Routine not found');
    return {
      id: row.id,
      classId: row.classId,
      subjectName: row.subjectName,
      subjectId: row.subjectId ?? undefined,
      teacherId: row.teacherId,
      teacherName: row.teacherProfile?.user?.name,
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
      room: row.room ?? undefined,
      academicYear: row.academicYear ?? undefined,
    };
  }
}
