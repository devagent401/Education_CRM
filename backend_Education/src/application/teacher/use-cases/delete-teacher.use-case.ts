import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class DeleteTeacherUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<{ message: string }> {
    const profile = await this.prisma.teacherProfile.findFirst({
      where: { id, deletedAt: null },
    });
    if (!profile) throw new NotFoundException('Teacher not found');

    await this.prisma.teacherProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await this.prisma.user.update({
      where: { id: profile.userId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Teacher deleted successfully' };
  }
}
