import { Module } from '@nestjs/common';
import { AttendanceController } from '../presentation/attendance/attendance.controller';
import { RecordAttendanceUseCase } from '../application/attendance/use-cases/record-attendance.use-case';
import { BulkAttendanceUseCase } from '../application/attendance/use-cases/bulk-attendance.use-case';
import { CsvAttendanceParser } from '../infrastructure/parsers/csv-attendance.parser';
import { ExcelAttendanceParser } from '../infrastructure/parsers/excel-attendance.parser';
import { ImageAttendanceParser } from '../infrastructure/ocr/image-attendance.parser';

@Module({
  controllers: [AttendanceController],
  providers: [
    RecordAttendanceUseCase,
    BulkAttendanceUseCase,
    CsvAttendanceParser,
    ExcelAttendanceParser,
    ImageAttendanceParser,
  ],
})
export class AttendanceModule {}
