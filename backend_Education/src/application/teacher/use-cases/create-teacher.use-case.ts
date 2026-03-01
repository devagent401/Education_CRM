import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { AuthService } from '../../../auth/auth.service';

export interface CreateTeacherInput {
  institutionId: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  employeeId?: string;
  department?: string;
  specialization?: string;
  salary?: number;
  joinDate?: Date;
}

@Injectable()
export class CreateTeacherUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async execute(input: CreateTeacherInput) {
    const existing = await this.prisma.user.findUnique({
      where: { institutionId_email: { institutionId: input.institutionId, email: input.email } },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await this.authService.hashPassword(input.password);
    const user = await this.prisma.user.create({
      data: {
        institutionId: input.institutionId,
        email: input.email,
        password: hashedPassword,
        name: input.name,
        phone: input.phone,
        role: 'TEACHER',
      },
    });

    await this.prisma.teacherProfile.create({
      data: {
        userId: user.id,
        institutionId: input.institutionId,
        employeeId: input.employeeId,
        department: input.department,
        specialization: input.specialization,
        salary: input.salary,
        joinDate: input.joinDate,
      },
    });

    const profile = await this.prisma.teacherProfile.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });
    return this.toResponse(profile!);
  }

  private toResponse(row: {
    id: string;
    institutionId: string;
    user: { id: string; email: string; name: string; phone: string | null };
    employeeId: string | null;
    department: string | null;
    specialization: string | null;
    salary: unknown;
    joinDate: Date | null;
  }) {
    return {
      id: row.id,
      userId: row.user.id,
      institutionId: row.institutionId,
      email: row.user.email,
      name: row.user.name,
      phone: row.user.phone ?? undefined,
      employeeId: row.employeeId ?? undefined,
      department: row.department ?? undefined,
      specialization: row.specialization ?? undefined,
      salary: row.salary ? Number(row.salary) : undefined,
      joinDate: row.joinDate ?? undefined,
    };
  }
}
