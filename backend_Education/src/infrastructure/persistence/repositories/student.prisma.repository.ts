import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  IStudentRepository,
  StudentFilters,
  PaginatedStudents,
} from '../../../domain/repositories';
import type { CreateStudentInput } from '../../../domain/entities';
import type { Student } from '../../../domain/entities';
import { StudentStatus } from '@prisma/client';

@Injectable()
export class StudentPrismaRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Student | null> {
    const row = await this.prisma.student.findFirst({
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
      where: this.buildWhere(institutionId, filters),
      orderBy: { rollNumber: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findManyPaginated(
    institutionId: string,
    filters: StudentFilters,
  ): Promise<PaginatedStudents> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(institutionId, filters);

    const [rows, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rollNumber: 'asc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      data: rows.map((r) => this.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private buildWhere(institutionId: string, filters?: StudentFilters) {
    const where: Record<string, unknown> = { institutionId, deletedAt: null };
    if (filters?.status) where.status = filters.status as StudentStatus;
    if (filters?.guardianId) where.guardianId = filters.guardianId;
    if (filters?.classId) where.classId = filters.classId;
    if (filters?.shift) where.shift = filters.shift;
    if (filters?.batch) where.batch = filters.batch;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { rollNumber: { contains: filters.search, mode: 'insensitive' } },
        { studentId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  async update(id: string, data: Partial<Student>): Promise<Student> {
    const row = await this.prisma.student.update({
      where: { id },
      data: {
        ...(data.rollNumber && { rollNumber: data.rollNumber }),
        ...(data.studentId && { studentId: data.studentId }),
        ...(data.name && { name: data.name }),
        ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth }),
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.guardianId !== undefined && { guardianId: data.guardianId }),
        ...(data.classId !== undefined && { classId: data.classId }),
        ...(data.shift !== undefined && { shift: data.shift }),
        ...(data.batch !== undefined && { batch: data.batch }),
        ...(data.status && { status: data.status as StudentStatus }),
        ...(data.admissionData !== undefined && { admissionData: data.admissionData as object }),
        ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
      },
    });
    return this.toDomain(row);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
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
        classId: data.classId,
        shift: data.shift,
        batch: data.batch,
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
    classId: string | null;
    shift: string | null;
    batch: string | null;
    status: string;
    admissionData: unknown;
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
      classId: row.classId ?? undefined,
      shift: row.shift ?? undefined,
      batch: row.batch ?? undefined,
      status: row.status as Student['status'],
      admissionData: row.admissionData as Record<string, unknown> | undefined,
      photoUrl: row.photoUrl ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    };
  }
}
