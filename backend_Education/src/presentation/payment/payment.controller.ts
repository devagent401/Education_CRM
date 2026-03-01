import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateFeeStructureDto, CreatePaymentDto, PaymentQueryDto } from './dto/payment.dto';
import { CreateFeeStructureUseCase } from '../../application/payment/use-cases/create-fee-structure.use-case';
import { CreatePaymentUseCase } from '../../application/payment/use-cases/create-payment.use-case';
import { ListStudentPaymentsUseCase } from '../../application/payment/use-cases/list-student-payments.use-case';
import { ListFeeStructuresUseCase } from '../../application/payment/use-cases/list-fee-structures.use-case';
import { InstitutionGuard } from '../common/guards/institution.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('payment')
@ApiSecurity('institution-id')
@Controller('payment')
@UseGuards(JwtAuthGuard, InstitutionGuard)
export class PaymentController {
  constructor(
    private readonly createFeeStructureUseCase: CreateFeeStructureUseCase,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly listStudentPaymentsUseCase: ListStudentPaymentsUseCase,
    private readonly listFeeStructuresUseCase: ListFeeStructuresUseCase,
  ) {}

  private getInstitutionId(req: Request): string {
    return (req as Request & { institutionId: string }).institutionId;
  }

  @Post('fee-structure')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create fee structure' })
  @ApiBody({ type: CreateFeeStructureDto })
  @ApiResponse({ status: 201 })
  async createFeeStructure(@Body() dto: CreateFeeStructureDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.createFeeStructureUseCase.execute({
      institutionId,
      name: dto.name,
      code: dto.code,
      amount: dto.amount,
      feeType: dto.feeType,
      classId: dto.classId,
      academicYear: dto.academicYear,
    });
  }

  @Get('fee-structure')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List fee structures' })
  @ApiResponse({ status: 200 })
  async listFeeStructures(
    @Query('classId') classId: string | undefined,
    @Query('academicYear') academicYear: string | undefined,
    @Query('page') page: number | undefined,
    @Query('limit') limit: number | undefined,
    @Req() req: Request,
  ) {
    const institutionId = this.getInstitutionId(req);
    return this.listFeeStructuresUseCase.execute(institutionId, {
      classId,
      academicYear,
      page,
      limit,
    });
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record student payment' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201 })
  async createPayment(@Body() dto: CreatePaymentDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    const user = (req as Request & { user?: { id: string } }).user;
    return this.createPaymentUseCase.execute({
      institutionId,
      studentId: dto.studentId,
      feeStructureId: dto.feeStructureId,
      amount: dto.amount,
      paidAmount: dto.paidAmount,
      paymentDate: new Date(dto.paymentDate),
      month: dto.month,
      year: dto.year,
      paymentMethod: dto.paymentMethod,
      referenceNo: dto.referenceNo,
      remarks: dto.remarks,
      receivedById: user?.id,
    });
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Student payment history (filter by studentId, month, year)' })
  @ApiResponse({ status: 200 })
  async paymentHistory(@Query() query: PaymentQueryDto, @Req() req: Request) {
    const institutionId = this.getInstitutionId(req);
    return this.listStudentPaymentsUseCase.execute(institutionId, {
      studentId: query.studentId,
      month: query.month,
      year: query.year,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
  }
}
