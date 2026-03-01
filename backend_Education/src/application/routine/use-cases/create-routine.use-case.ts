import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface CreateRoutineInput {
  institutionId: string;
  classId: string;
  subjectName: string;
  subjectId?: string;
  teacherId: string;
  teacherProfileId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  academicYear?: string;
}

@Injectable()
export class CreateRoutineUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: CreateRoutineInput) {
    const row = await this.prisma.classRoutine.create({
      data: {
        institutionId: input.institutionId,
        classId: input.classId,
        subjectName: input.subjectName,
        subjectId: input.subjectId,
        teacherId: input.teacherId,
        teacherProfileId: input.teacherProfileId,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime: input.endTime,
        room: input.room,
        academicYear: input.academicYear,
      },
    });
    return this.toResponse(row);
  }

  private toResponse(row: { id: string; classId: string; subjectName: string | null; subjectId: string | null; teacherId: string; dayOfWeek: number; startTime: string; endTime: string; room: string | null; academicYear: string | null; createdAt: Date }) {
    return {
      id: row.id,
      classId: row.classId,
      subjectName: row.subjectName ?? '',
      subjectId: row.subjectId ?? undefined,
      teacherId: row.teacherId,
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
      room: row.room ?? undefined,
      academicYear: row.academicYear ?? undefined,
      createdAt: row.createdAt,
    };
  }
}
