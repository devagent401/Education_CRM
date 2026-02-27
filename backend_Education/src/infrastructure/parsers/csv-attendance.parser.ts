import { Injectable } from '@nestjs/common';
import type { AttendanceStatus } from '../../domain/entities';

export interface CsvParseResult {
  rows: RawCsvRow[];
  errors: Array<{ row: number; message: string }>;
}

export interface RawCsvRow {
  row: number;
  rollNumber?: string;
  studentId?: string;
  status: string;
  remarks?: string;
}

const VALID_STATUSES: AttendanceStatus[] = [
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED',
  'LEAVE',
];

@Injectable()
export class CsvAttendanceParser {
  /**
   * Parse CSV content to attendance rows
   * Expected columns: roll_number|rollNumber, student_id|studentId, status, remarks
   */
  parse(csvContent: string): CsvParseResult {
    const lines = csvContent.trim().split(/\r?\n/);
    const rows: RawCsvRow[] = [];
    const errors: Array<{ row: number; message: string }> = [];

    if (lines.length < 2) {
      return {
        rows: [],
        errors: [
          {
            row: 0,
            message: 'CSV must have header and at least one data row',
          },
        ],
      };
    }

    const headerLine = lines[0];
    const headers = headerLine.split(',').map((h) => h.trim().toLowerCase());
    const headerMap = new Map<string, number>();
    headers.forEach((h, i) => {
      const key = h.replace(/\s/g, '_');
      headerMap.set(key, i);
      if (key === 'roll_number' || key === 'rollnumber') {
        headerMap.set('roll', i);
      }
      if (key === 'student_id' || key === 'studentid') {
        headerMap.set('student', i);
      }
    });

    const rollIdx =
      headerMap.get('roll_number') ?? headerMap.get('rollnumber') ?? headerMap.get('roll');
    const studentIdIdx =
      headerMap.get('student_id') ??
      headerMap.get('studentid') ??
      headerMap.get('student');
    const statusIdx = headerMap.get('status');
    const remarksIdx = headerMap.get('remarks');

    if (statusIdx === undefined) {
      return {
        rows: [],
        errors: [{ row: 1, message: 'Missing required column: status' }],
      };
    }

    if (rollIdx === undefined && studentIdIdx === undefined) {
      return {
        rows: [],
        errors: [
          {
            row: 1,
            message: 'Missing required column: roll_number or student_id',
          },
        ],
      };
    }

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      const rowNum = i + 1;

      const rollNumber =
        rollIdx !== undefined ? values[rollIdx]?.trim() : undefined;
      const studentId =
        studentIdIdx !== undefined ? values[studentIdIdx]?.trim() : undefined;
      const status = values[statusIdx]?.trim().toUpperCase();
      const remarks =
        remarksIdx !== undefined ? values[remarksIdx]?.trim() : undefined;

      if (!rollNumber && !studentId) {
        errors.push({
          row: rowNum,
          message: 'Either roll_number or student_id required',
        });
        continue;
      }

      if (!status || !VALID_STATUSES.includes(status as AttendanceStatus)) {
        errors.push({
          row: rowNum,
          message: `Invalid status. Must be: ${VALID_STATUSES.join(', ')}`,
        });
        continue;
      }

      rows.push({
        row: rowNum,
        rollNumber: rollNumber || undefined,
        studentId: studentId || undefined,
        status,
        remarks,
      });
    }

    return { rows, errors };
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }
}
