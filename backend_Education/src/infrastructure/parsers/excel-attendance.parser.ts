import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import type { AttendanceStatus } from '../../domain/entities';

export interface ExcelParseResult {
  rows: RawExcelRow[];
  errors: Array<{ row: number; message: string }>;
}

export interface RawExcelRow {
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
export class ExcelAttendanceParser {
  /**
   * Parse Excel (.xlsx) buffer to attendance rows
   * Expected columns: roll_number, student_id, status, remarks
   */
  parse(buffer: Buffer): ExcelParseResult {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(sheet, {
      header: 1,
      defval: '',
    }) as (string | number)[][];

    const rows: RawExcelRow[] = [];
    const errors: Array<{ row: number; message: string }> = [];

    if (!data || data.length < 2) {
      return {
        rows: [],
        errors: [
          {
            row: 0,
            message: 'Excel must have header and at least one data row',
          },
        ],
      };
    }

    const headerRow = (data[0] as string[]).map((h) =>
      String(h).trim().toLowerCase(),
    );
    const getCol = (keys: string[]): number => {
      for (const k of keys) {
        const idx = headerRow.findIndex(
          (h) => h.replace(/\s/g, '_') === k || h === k,
        );
        if (idx >= 0) return idx;
      }
      return -1;
    };

    const rollIdx = getCol(['roll_number', 'rollnumber', 'roll']);
    const studentIdIdx = getCol(['student_id', 'studentid', 'student']);
    const statusIdx = getCol(['status']);
    const remarksIdx = getCol(['remarks']);

    if (statusIdx < 0) {
      return {
        rows: [],
        errors: [{ row: 1, message: 'Missing required column: status' }],
      };
    }

    if (rollIdx < 0 && studentIdIdx < 0) {
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

    for (let i = 1; i < data.length; i++) {
      const rowData = data[i] as (string | number)[];
      const rowNum = i + 1;

      const rollNumber =
        rollIdx >= 0 ? String(rowData[rollIdx] ?? '').trim() : undefined;
      const studentId =
        studentIdIdx >= 0
          ? String(rowData[studentIdIdx] ?? '').trim()
          : undefined;
      const status = String(rowData[statusIdx] ?? '').trim().toUpperCase();
      const remarks =
        remarksIdx >= 0 ? String(rowData[remarksIdx] ?? '').trim() : undefined;

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
}
