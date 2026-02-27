import { Injectable, Inject } from '@nestjs/common';
import type {
  IAttendanceRepository,
  IStudentRepository,
  CreateAttendanceInput,
} from '../../../domain/repositories';
import type {
  AttendanceUploadPreview,
  AttendanceUploadRow,
  InvalidAttendanceRow,
  AttendanceStatus,
  AttendanceSource,
} from '../../../domain/entities';

export interface BulkAttendanceInput {
  institutionId: string;
  date: Date;
  rows: AttendanceUploadRow[];
  recordedById?: string;
  source: AttendanceSource;
  sourceRef?: string;
}

export interface BulkAttendanceResult {
  created: number;
  skipped: number;
  errors: Array<{ row: number; error: string }>;
}

@Injectable()
export class BulkAttendanceUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly attendanceRepository: IAttendanceRepository,
    @Inject('IStudentRepository')
    private readonly studentRepository: IStudentRepository,
  ) {}

  async validateAndPreview(
    institutionId: string,
    date: Date,
    rows: AttendanceUploadRow[],
  ): Promise<AttendanceUploadPreview> {
    const valid: AttendanceUploadRow[] = [];
    const invalid: InvalidAttendanceRow[] = [];
    const validStatuses: AttendanceStatus[] = [
      'PRESENT',
      'ABSENT',
      'LATE',
      'EXCUSED',
      'LEAVE',
    ];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const errors: string[] = [];

      if (!row.rollNumber && !row.studentId) {
        errors.push('Either rollNumber or studentId is required');
      }

      if (!row.status || !validStatuses.includes(row.status)) {
        errors.push(
          `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        );
      }

      if (errors.length > 0) {
        invalid.push({ ...row, row: i + 1, errors });
        continue;
      }

      const student = row.rollNumber
        ? await this.studentRepository.findByInstitutionAndRoll(
            institutionId,
            row.rollNumber,
          )
        : await this.studentRepository.findByInstitutionAndStudentId(
            institutionId,
            row.studentId!,
          );

      if (!student) {
        invalid.push({
          ...row,
          row: i + 1,
          errors: ['Student not found'],
        });
        continue;
      }

      valid.push(row);
    }

    return {
      valid,
      invalid,
      totalProcessed: rows.length,
    };
  }

  async execute(input: BulkAttendanceInput): Promise<BulkAttendanceResult> {
    const preview = await this.validateAndPreview(
      input.institutionId,
      input.date,
      input.rows,
    );

    const toCreate: CreateAttendanceInput[] = [];
    const errors: Array<{ row: number; error: string }> = [];

    for (const invalidRow of preview.invalid) {
      errors.push({
        row: invalidRow.row,
        error: invalidRow.errors.join('; '),
      });
    }

    for (const row of preview.valid) {
      const student = row.rollNumber
        ? await this.studentRepository.findByInstitutionAndRoll(
            input.institutionId,
            row.rollNumber,
          )
        : await this.studentRepository.findByInstitutionAndStudentId(
            input.institutionId,
            row.studentId!,
          );

      if (student) {
        const existing = await this.attendanceRepository.findByStudentAndDate(
          input.institutionId,
          student.id,
          input.date,
        );

        if (!existing) {
          toCreate.push({
            institutionId: input.institutionId,
            studentId: student.id,
            date: input.date,
            status: row.status,
            remarks: row.remarks,
            recordedById: input.recordedById,
            source: input.source,
            sourceRef: input.sourceRef,
          });
        } else {
          errors.push({
            row: preview.valid.indexOf(row) + 1,
            error: 'Attendance already exists',
          });
        }
      }
    }

    if (toCreate.length > 0) {
      await this.attendanceRepository.createMany(toCreate);
    }

    return {
      created: toCreate.length,
      skipped: preview.valid.length - toCreate.length,
      errors,
    };
  }
}
