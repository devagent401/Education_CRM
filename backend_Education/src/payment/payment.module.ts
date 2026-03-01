import { Module } from '@nestjs/common';
import { PaymentController } from '../presentation/payment/payment.controller';
import { CreateFeeStructureUseCase } from '../application/payment/use-cases/create-fee-structure.use-case';
import { CreatePaymentUseCase } from '../application/payment/use-cases/create-payment.use-case';
import { ListStudentPaymentsUseCase } from '../application/payment/use-cases/list-student-payments.use-case';
import { ListFeeStructuresUseCase } from '../application/payment/use-cases/list-fee-structures.use-case';

@Module({
  controllers: [PaymentController],
  providers: [
    CreateFeeStructureUseCase,
    CreatePaymentUseCase,
    ListStudentPaymentsUseCase,
    ListFeeStructuresUseCase,
  ],
})
export class PaymentModule {}
