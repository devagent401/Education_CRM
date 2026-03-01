import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface CreatePaymentInput {
  institutionId: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  paidAmount: number;
  paymentDate: Date;
  month?: number;
  year?: number;
  paymentMethod?: string;
  referenceNo?: string;
  remarks?: string;
  receivedById?: string;
}

@Injectable()
export class CreatePaymentUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: CreatePaymentInput) {
    const student = await this.prisma.student.findFirst({
      where: { id: input.studentId, institutionId: input.institutionId, deletedAt: null },
    });
    if (!student) throw new NotFoundException('Student not found');

    const fee = await this.prisma.feeStructure.findFirst({
      where: { id: input.feeStructureId, institutionId: input.institutionId, deletedAt: null },
    });
    if (!fee) throw new NotFoundException('Fee structure not found');

    const dueAmount = input.amount - input.paidAmount;
    const status = dueAmount <= 0 ? 'PAID' : input.paidAmount > 0 ? 'PARTIAL' : 'PENDING';

    const row = await this.prisma.studentPayment.create({
      data: {
        institutionId: input.institutionId,
        studentId: input.studentId,
        feeStructureId: input.feeStructureId,
        amount: input.amount,
        paidAmount: input.paidAmount,
        dueAmount,
        paymentDate: input.paymentDate,
        month: input.month,
        year: input.year,
        status: status as any,
        paymentMethod: input.paymentMethod,
        referenceNo: input.referenceNo,
        remarks: input.remarks,
        receivedById: input.receivedById,
      },
    });
    return {
      id: row.id,
      studentId: row.studentId,
      amount: Number(row.amount),
      paidAmount: Number(row.paidAmount),
      dueAmount: Number(row.dueAmount),
      status: row.status,
      paymentDate: row.paymentDate,
    };
  }
}
