import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface UpdateTeacherInput {
  name?: string;
  phone?: string;
  employeeId?: string;
  department?: string;
  specialization?: string;
  salary?: number;
  joinDate?: Date;
}

@Injectable()
export class UpdateTeacherUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, data: UpdateTeacherInput) {
    const profile = await this.prisma.teacherProfile.findFirst({
      where: { id, deletedAt: null },
      include: { user: true },
    });
    if (!profile) throw new NotFoundException('Teacher not found');

    if (data.name || data.phone !== undefined) {
      await this.prisma.user.update({
        where: { id: profile.userId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.phone !== undefined && { phone: data.phone }),
        },
      });
    }

    await this.prisma.teacherProfile.update({
      where: { id },
      data: {
        ...(data.employeeId !== undefined && { employeeId: data.employeeId }),
        ...(data.department !== undefined && { department: data.department }),
        ...(data.specialization !== undefined && { specialization: data.specialization }),
        ...(data.salary !== undefined && { salary: data.salary }),
        ...(data.joinDate !== undefined && { joinDate: data.joinDate }),
      },
    });

    return this.prisma.teacherProfile.findUnique({
      where: { id },
      include: { user: true },
    }).then((r) => ({
      id: r!.id,
      userId: r!.userId,
      institutionId: r!.institutionId,
      email: r!.user.email,
      name: r!.user.name,
      phone: r!.user.phone ?? undefined,
      employeeId: r!.employeeId ?? undefined,
      department: r!.department ?? undefined,
      specialization: r!.specialization ?? undefined,
      salary: r!.salary ? Number(r!.salary) : undefined,
      joinDate: r!.joinDate ?? undefined,
    }));
  }
}
