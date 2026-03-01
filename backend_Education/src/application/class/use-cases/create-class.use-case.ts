import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface CreateClassInput {
  institutionId: string;
  name: string;
  code: string;
  level?: number; // 1=Class, 2=Section, 3=Shift
  parentId?: string;
  sortOrder?: number;
}

@Injectable()
export class CreateClassUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: CreateClassInput) {
    const existing = await this.prisma.academicStructure.findFirst({
      where: { institutionId: input.institutionId, code: input.code, deletedAt: null },
    });
    if (existing) throw new ConflictException('Code already exists');

    const row = await this.prisma.academicStructure.create({
      data: {
        institutionId: input.institutionId,
        name: input.name,
        code: input.code,
        level: input.level ?? 1,
        parentId: input.parentId,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return this.toResponse(row);
  }

  private toResponse(row: { id: string; name: string; code: string; level: number; parentId: string | null; sortOrder: number; isActive: boolean; metadata: unknown; createdAt: Date; updatedAt: Date }) {
    return {
      id: row.id,
      name: row.name,
      code: row.code,
      level: row.level,
      parentId: row.parentId ?? undefined,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
      metadata: row.metadata,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
