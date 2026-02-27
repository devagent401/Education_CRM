/**
 * Attendance - Domain Entity
 * Pure domain model, no framework dependencies
 */
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'LEAVE';

export type AttendanceSource = 'MANUAL' | 'CSV' | 'EXCEL' | 'IMAGE_OCR';

export interface AttendanceRecord {
  id: string;
  institutionId: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  recordedById?: string;
  source: AttendanceSource;
  sourceRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceUploadPreview {
  valid: AttendanceUploadRow[];
  invalid: InvalidAttendanceRow[];
  totalProcessed: number;
}

export interface AttendanceUploadRow {
  rollNumber?: string;
  studentId?: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface InvalidAttendanceRow extends AttendanceUploadRow {
  row: number;
  errors: string[];
}
