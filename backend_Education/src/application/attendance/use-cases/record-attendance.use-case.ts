import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type {
  IAttendanceRepository,
  IStudentRepository,
  CreateAttendanceInput,
} from '../../../domain/repositories';
import type { AttendanceStatus, AttendanceSource } from '../../../domain/entities';

export interface RecordAttendanceInput {
  institutionId: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  recordedById?: string;
  source: AttendanceSource;
  sourceRef?: string;
}

@Injectable()
export class RecordAttendanceUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly attendanceRepository: IAttendanceRepository,
    @Inject('IStudentRepository')
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute(input: RecordAttendanceInput) {
    const student = await this.studentRepository.findById(input.studentId);

    if (!student || student.institutionId !== input.institutionId) {
      throw new ConflictException('Student not found');
    }

    const existing = await this.attendanceRepository.findByStudentAndDate(
      input.institutionId,
      input.studentId,
      input.date,
    );

    if (existing) {
      throw new ConflictException(
        `Attendance already recorded for this date`,
      );
    }

    const data: CreateAttendanceInput = {
      institutionId: input.institutionId,
      studentId: input.studentId,
      date: input.date,
      status: input.status,
      remarks: input.remarks,
      recordedById: input.recordedById,
      source: input.source,
      sourceRef: input.sourceRef,
    };

    return this.attendanceRepository.create(data);
  }
}
