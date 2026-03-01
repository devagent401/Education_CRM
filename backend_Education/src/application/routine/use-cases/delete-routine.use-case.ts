import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class DeleteRoutineUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<{ message: string }> {
    const existing = await this.prisma.classRoutine.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Routine not found');

    await this.prisma.classRoutine.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Routine deleted successfully' };
  }
}
