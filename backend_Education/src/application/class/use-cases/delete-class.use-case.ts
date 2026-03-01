import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class DeleteClassUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<{ message: string }> {
    const existing = await this.prisma.academicStructure.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Class not found');

    await this.prisma.academicStructure.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Class deleted successfully' };
  }
}
