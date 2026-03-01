import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class UpdateRoutineUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, data: { subjectName?: string; teacherId?: string; dayOfWeek?: number; startTime?: string; endTime?: string; room?: string }) {
    const existing = await this.prisma.classRoutine.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Routine not found');

    const row = await this.prisma.classRoutine.update({
      where: { id },
      data: {
        ...(data.subjectName && { subjectName: data.subjectName }),
        ...(data.teacherId && { teacherId: data.teacherId }),
        ...(data.dayOfWeek !== undefined && { dayOfWeek: data.dayOfWeek }),
        ...(data.startTime && { startTime: data.startTime }),
        ...(data.endTime && { endTime: data.endTime }),
        ...(data.room !== undefined && { room: data.room }),
      },
    });
    return {
      id: row.id,
      classId: row.classId,
      subjectName: row.subjectName,
      teacherId: row.teacherId,
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
      room: row.room ?? undefined,
    };
  }
}
