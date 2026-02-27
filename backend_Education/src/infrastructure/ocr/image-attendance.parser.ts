import { Injectable } from '@nestjs/common';
import Tesseract from 'tesseract.js';
import type { AttendanceStatus } from '../../domain/entities';

export interface ImageParseResult {
  rows: RawImageRow[];
  errors: string[];
}

export interface RawImageRow {
  rollNumber?: string;
  studentId?: string;
  status: AttendanceStatus;
  remarks?: string;
}

const VALID_STATUSES: AttendanceStatus[] = [
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED',
  'LEAVE',
];

const STATUS_PATTERNS = [
  /\b(p|present|✓|✔)\b/i,
  /\b(a|absent|✗|✘|×)\b/i,
  /\b(l|late)\b/i,
  /\b(e|excused)\b/i,
  /\b(lv|leave)\b/i,
];

@Injectable()
export class ImageAttendanceParser {
  /**
   * Parse attendance from image using OCR (Tesseract)
   * Expects structured format: roll/student_id + status columns
   */
  async parse(imageBuffer: Buffer): Promise<ImageParseResult> {
    const { data } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: () => {},
    });

    const text = data.text;
    const errors: string[] = [];

    if (!text || !text.trim()) {
      return {
        rows: [],
        errors: ['No text detected in image'],
      };
    }

    const rows: RawImageRow[] = [];
    const lines = text.split(/\r?\n/).filter((l) => l.trim());

    for (const line of lines) {
      const parts = line.split(/\s+/).filter(Boolean);
      if (parts.length < 2) continue;

      // First part(s) = roll/student id, last = status
      const possibleId = parts[0].replace(/[^\w\-]/g, '');
      const possibleStatus = this.normalizeStatus(parts[parts.length - 1]);

      if (!possibleId || possibleId.length < 1) continue;
      if (!possibleStatus) continue;

      const isNumeric = /^\d+$/.test(possibleId);
      rows.push({
        rollNumber: isNumeric ? possibleId : undefined,
        studentId: !isNumeric ? possibleId : undefined,
        status: possibleStatus,
      });
    }

    return { rows, errors };
  }

  private normalizeStatus(raw: string): AttendanceStatus | null {
    const s = raw.trim().toUpperCase();
    if (VALID_STATUSES.includes(s as AttendanceStatus)) {
      return s as AttendanceStatus;
    }
    if (/^P$|PRESENT|✓|✔/.test(s)) return 'PRESENT';
    if (/^A$|ABSENT|✗|✘|×/.test(s)) return 'ABSENT';
    if (/^L$|LATE/.test(s)) return 'LATE';
    if (/^E$|EXCUSED/.test(s)) return 'EXCUSED';
    if (/^LV$|LEAVE/.test(s)) return 'LEAVE';
    return null;
  }
}
