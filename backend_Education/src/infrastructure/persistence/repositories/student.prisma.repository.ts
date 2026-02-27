import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  IStudentRepository,
  StudentFilters,
  CreateStudentInput,
} from '../../../domain/repositories';
import type { Student } from '../../../domain/entities';
import { StudentStatus } from '@prisma/client';

@Injectable()
export class StudentPrismaRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Student | null> {
    const row = await this.prisma.student.findUnique({
      where: { id, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByInstitutionAndRoll(
    institutionId: string,
    rollNumber: string,
  ): Promise<Student | null> {
    const row = await this.prisma.student.findFirst({
      where: { institutionId, rollNumber, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByInstitutionAndStudentId(
    institutionId: string,
    studentId: string,
  ): Promise<Student | null> {
    const row = await this.prisma.student.findFirst({
      where: { institutionId, studentId, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findManyByInstitution(
    institutionId: string,
    filters?: StudentFilters,
  ): Promise<Student[]> {
    const rows = await this.prisma.student.findMany({
      where: {
        institutionId,
        deletedAt: null,
        ...(filters?.status && { status: filters.status as StudentStatus }),
        ...(filters?.guardianId && { guardianId: filters.guardianId }),
      },
      orderBy: { rollNumber: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async create(data: CreateStudentInput): Promise<Student> {
    const row = await this.prisma.student.create({
      data: {
        institutionId: data.institutionId,
        rollNumber: data.rollNumber,
        studentId: data.studentId,
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        guardianId: data.guardianId,
        admissionData: data.admissionData as object,
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    institutionId: string;
    rollNumber: string;
    studentId: string;
    name: string;
    dateOfBirth: Date | null;
    gender: string | null;
    guardianId: string | null;
    status: string;
    admissionData: object | null;
    photoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): Student {
    return {
      id: row.id,
      institutionId: row.institutionId,
      rollNumber: row.rollNumber,
      studentId: row.studentId,
      name: row.name,
      dateOfBirth: row.dateOfBirth ?? undefined,
      gender: row.gender ?? undefined,
      guardianId: row.guardianId ?? undefined,
      status: row.status as Student['status'],
      admissionData: row.admissionData as Record<string, unknown> | undefined,
      photoUrl: row.photoUrl ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    };
  }
}
