import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface PaymentFilters {
  studentId?: string;
  month?: number;
  year?: number;
  status?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ListStudentPaymentsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(institutionId: string, filters: PaymentFilters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { institutionId };
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.month !== undefined) where.month = filters.month;
    if (filters.year !== undefined) where.year = filters.year;
    if (filters.status) where.status = filters.status;

    const [rows, total] = await Promise.all([
      this.prisma.studentPayment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { paymentDate: 'desc' },
        include: { student: true, feeStructure: true },
      }),
      this.prisma.studentPayment.count({ where }),
    ]);

    return {
      data: rows.map((r) => ({
        id: r.id,
        studentId: r.studentId,
        studentName: r.student.name,
        feeStructureId: r.feeStructureId,
        feeName: r.feeStructure.name,
        amount: Number(r.amount),
        paidAmount: Number(r.paidAmount),
        dueAmount: Number(r.dueAmount),
        status: r.status,
        paymentDate: r.paymentDate,
        month: r.month,
        year: r.year,
        paymentMethod: r.paymentMethod,
        referenceNo: r.referenceNo,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
