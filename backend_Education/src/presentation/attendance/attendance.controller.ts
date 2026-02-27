import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RecordAttendanceDto } from './dto/attendance.dto';
import { RecordAttendanceUseCase } from '../../application/attendance/use-cases/record-attendance.use-case';
import { BulkAttendanceUseCase } from '../../application/attendance/use-cases/bulk-attendance.use-case';
import { CsvAttendanceParser } from '../../infrastructure/parsers/csv-attendance.parser';
import { ExcelAttendanceParser } from '../../infrastructure/parsers/excel-attendance.parser';
import { ImageAttendanceParser } from '../../infrastructure/ocr/image-attendance.parser';
import { InstitutionGuard } from '../common/guards/institution.guard';

/** Extend Express Request for institutionId */
interface InstitutionRequest {
  institutionId: string;
  user?: { id: string };
}

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(InstitutionGuard)
export class AttendanceController {
  constructor(
    private readonly recordAttendanceUseCase: RecordAttendanceUseCase,
    private readonly bulkAttendanceUseCase: BulkAttendanceUseCase,
    private readonly csvParser: CsvAttendanceParser,
    private readonly excelParser: ExcelAttendanceParser,
    private readonly imageParser: ImageAttendanceParser,
  ) {}

  @Post('record')
  @ApiBearerAuth()
  async record(
    @Body() dto: RecordAttendanceDto,
    // @Req() req: InstitutionRequest,
  ) {
    // In real app: req from guard, user from JWT
    const institutionId = 'inst-placeholder'; // From guard
    const recordedById = 'user-placeholder'; // From JWT

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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        date: { type: 'string', format: 'date' },
      },
    },
  })
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('date') date: string,
    // @Req() req: InstitutionRequest,
  ) {
    const institutionId = 'inst-placeholder';
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
  async submitCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('date') date: string,
  ) {
    const institutionId = 'inst-placeholder';
    const recordedById = 'user-placeholder';
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
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body('date') date: string,
  ) {
    const institutionId = 'inst-placeholder';
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
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('date') date: string,
  ) {
    const institutionId = 'inst-placeholder';
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
