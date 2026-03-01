import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class GetTeacherUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string) {
    const row = await this.prisma.teacherProfile.findFirst({
      where: { id, deletedAt: null },
      include: { user: true },
    });
    if (!row) throw new NotFoundException('Teacher not found');
    return {
      id: row.id,
      userId: row.userId,
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
