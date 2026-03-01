import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { RecordAttendanceDto } from './dto/attendance.dto';
import { RecordAttendanceUseCase } from '../../application/attendance/use-cases/record-attendance.use-case';
import { BulkAttendanceUseCase } from '../../application/attendance/use-cases/bulk-attendance.use-case';
import { CsvAttendanceParser } from '../../infrastructure/parsers/csv-attendance.parser';
import { ExcelAttendanceParser } from '../../infrastructure/parsers/excel-attendance.parser';
import { ImageAttendanceParser } from '../../infrastructure/ocr/image-attendance.parser';
import { InstitutionGuard } from '../common/guards/institution.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('attendance')
@ApiSecurity('institution-id')
@Controller('attendance')
@UseGuards(JwtAuthGuard, InstitutionGuard)
export class AttendanceController {
  constructor(
    private readonly recordAttendanceUseCase: RecordAttendanceUseCase,
    private readonly bulkAttendanceUseCase: BulkAttendanceUseCase,
    private readonly csvParser: CsvAttendanceParser,
    private readonly excelParser: ExcelAttendanceParser,
    private readonly imageParser: ImageAttendanceParser,
  ) {}

  private getContext(req: Request) {
    const instId = (req as Request & { institutionId: string }).institutionId;
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    return { institutionId: instId, recordedById: userId ?? '' };
  }

  @Post('record')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record attendance', description: 'Record single attendance entry manually' })
  @ApiBody({ type: RecordAttendanceDto })
  @ApiResponse({ status: 201, description: 'Attendance recorded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or missing x-institution-id' })
  async record(@Body() dto: RecordAttendanceDto, @Req() req: Request) {
    const { institutionId, recordedById } = this.getContext(req);

    return this.recordAttendanceUseCase.execute({
      institutionId,
      studentId: dto.studentId,
      date: new Date(dto.date),
      status: dto.status as any,
      remarks: dto.remarks,
      recordedById,
      source: 'MANUAL',
    });
  }

  @Post('upload/csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload CSV (preview)', description: 'Preview and validate CSV attendance upload without creating records' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'date'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'CSV file with columns: roll_number, student_id, status, remarks' },
        date: { type: 'string', format: 'date', example: '2025-02-28' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Preview with valid/invalid counts' })
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('date') date: string,
    @Req() req: Request,
  ) {
    const { institutionId } = this.getContext(req);
    const csvContent = file.buffer.toString('utf-8');
    const { rows, errors } = this.csvParser.parse(csvContent);

    const preview = await this.bulkAttendanceUseCase.validateAndPreview(
      institutionId,
      new Date(date),
      rows.map((r) => ({
        rollNumber: r.rollNumber,
        studentId: r.studentId,
        status: r.status as any,
        remarks: r.remarks,
      })),
    );

    return {
      preview,
      parseErrors: errors,
    };
  }

  @Post('upload/csv/submit')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload CSV (submit)', description: 'Submit CSV attendance upload and create records' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'date'],
      properties: {
        file: { type: 'string', format: 'binary' },
        date: { type: 'string', format: 'date', example: '2025-02-28' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Upload result with created/skipped/errors counts' })
  async submitCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('date') date: string,
    @Req() req: Request,
  ) {
    const { institutionId, recordedById } = this.getContext(req);
    const csvContent = file.buffer.toString('utf-8');
    const { rows, errors } = this.csvParser.parse(csvContent);

    if (errors.length > 0) {
      return { created: 0, skipped: 0, errors };
    }

    const result = await this.bulkAttendanceUseCase.execute({
      institutionId,
      date: new Date(date),
      rows: rows.map((r) => ({
        rollNumber: r.rollNumber,
        studentId: r.studentId,
        status: r.status as any,
        remarks: r.remarks,
      })),
      recordedById,
      source: 'CSV',
      sourceRef: file.originalname,
    });

    return result;
  }

  @Post('upload/excel')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload Excel', description: 'Preview Excel attendance upload' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'date'],
      properties: {
        file: { type: 'string', format: 'binary' },
        date: { type: 'string', format: 'date', example: '2025-02-28' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Preview with valid/invalid counts' })
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body('date') date: string,
    @Req() req: Request,
  ) {
    const { institutionId } = this.getContext(req);
    const { rows, errors } = this.excelParser.parse(file.buffer);

    const preview = await this.bulkAttendanceUseCase.validateAndPreview(
      institutionId,
      new Date(date),
      rows.map((r) => ({
        rollNumber: r.rollNumber,
        studentId: r.studentId,
        status: r.status as any,
        remarks: r.remarks,
      })),
    );

    return { preview, parseErrors: errors };
  }

  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image (OCR)', description: 'Preview OCR-based image attendance upload' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'date'],
      properties: {
        file: { type: 'string', format: 'binary' },
        date: { type: 'string', format: 'date', example: '2025-02-28' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Preview with valid/invalid counts or parse errors' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('date') date: string,
    @Req() req: Request,
  ) {
    const { institutionId } = this.getContext(req);
    const { rows, errors } = await this.imageParser.parse(file.buffer);

    if (errors.length > 0) {
      return { preview: null, parseErrors: errors };
    }

    const preview = await this.bulkAttendanceUseCase.validateAndPreview(
      institutionId,
      new Date(date),
      rows,
    );

    return { preview, parseErrors: [] };
  }
}
