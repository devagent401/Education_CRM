import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  IAttendanceRepository,
  CreateAttendanceInput,
} from '../../../domain/repositories';
import type { AttendanceRecord } from '../../../domain/entities';
import { AttendanceStatus, AttendanceSource } from '@prisma/client';

@Injectable()
export class AttendancePrismaRepository implements IAttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAttendanceInput): Promise<AttendanceRecord> {
    const row = await this.prisma.attendanceRecord.create({
      data: {
        institutionId: data.institutionId,
        studentId: data.studentId,
        date: data.date,
        status: data.status as AttendanceStatus,
        remarks: data.remarks,
        recordedById: data.recordedById,
        source: data.source as AttendanceSource,
        sourceRef: data.sourceRef,
      },
    });
    return this.toDomain(row);
  }

  async createMany(data: CreateAttendanceInput[]): Promise<AttendanceRecord[]> {
    const rows = await this.prisma.attendanceRecord.createManyAndReturn({
      data: data.map((d) => ({
        institutionId: d.institutionId,
        studentId: d.studentId,
        date: d.date,
        status: d.status as AttendanceStatus,
        remarks: d.remarks,
        recordedById: d.recordedById,
        source: d.source as AttendanceSource,
        sourceRef: d.sourceRef,
      })),
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findByStudentAndDate(
    institutionId: string,
    studentId: string,
    date: Date,
  ): Promise<AttendanceRecord | null> {
    const row = await this.prisma.attendanceRecord.findUnique({
      where: {
        institutionId_studentId_date: {
          institutionId,
          studentId,
          date,
        },
      },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByDateAndInstitution(
    institutionId: string,
    date: Date,
  ): Promise<AttendanceRecord[]> {
    const rows = await this.prisma.attendanceRecord.findMany({
      where: { institutionId, date },
    });
    return rows.map((r) => this.toDomain(r));
  }

  private toDomain(row: {
    id: string;
    institutionId: string;
    studentId: string;
    date: Date;
    status: string;
    remarks: string | null;
    recordedById: string | null;
    source: string;
    sourceRef: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): AttendanceRecord {
    return {
      id: row.id,
      institutionId: row.institutionId,
      studentId: row.studentId,
      date: row.date,
      status: row.status as AttendanceRecord['status'],
      remarks: row.remarks ?? undefined,
      recordedById: row.recordedById ?? undefined,
      source: row.source as AttendanceRecord['source'],
      sourceRef: row.sourceRef ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
