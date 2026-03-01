import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface CreateFeeStructureInput {
  institutionId: string;
  name: string;
  code: string;
  amount: number;
  feeType?: string;
  classId?: string;
  academicYear?: string;
}

@Injectable()
export class CreateFeeStructureUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: CreateFeeStructureInput) {
    const existing = await this.prisma.feeStructure.findFirst({
      where: { institutionId: input.institutionId, code: input.code, deletedAt: null },
    });
    if (existing) throw new ConflictException('Fee code already exists');

    const row = await this.prisma.feeStructure.create({
      data: {
        institutionId: input.institutionId,
        name: input.name,
        code: input.code,
        amount: input.amount,
        feeType: (input.feeType as any) ?? 'MONTHLY',
        classId: input.classId,
        academicYear: input.academicYear,
      },
    });
    return { id: row.id, name: row.name, code: row.code, amount: Number(row.amount), feeType: row.feeType };
  }
}
