import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum AttendanceStatusDto {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
  LEAVE = 'LEAVE',
}

export class RecordAttendanceDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ example: '2025-02-27' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: AttendanceStatusDto })
  @IsEnum(AttendanceStatusDto)
  status: AttendanceStatusDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class BulkAttendanceUploadDto {
  @ApiProperty({ example: '2025-02-27' })
  @IsDateString()
  date: string;
}

export class AttendancePreviewResponseDto {
  @ApiProperty()
  valid: number;

  @ApiProperty()
  invalid: number;

  @ApiProperty()
  totalProcessed: number;

  @ApiProperty()
  invalidRows: Array<{ row: number; errors: string[] }>;
}
