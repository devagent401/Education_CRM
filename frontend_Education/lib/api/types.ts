/**
 * Shared API types matching backend DTOs and responses
 */

// Auth
export interface LoginRequest {
  institutionId: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Institution
export interface CreateInstitutionRequest {
  name: string;
  code: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Attendance
export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EXCUSED"
  | "LEAVE";

export interface RecordAttendanceRequest {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  institutionId: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendancePreviewRow {
  rollNumber?: string;
  studentId?: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface InvalidAttendanceRow extends AttendancePreviewRow {
  row: number;
  errors: string[];
}

export interface AttendanceUploadPreview {
  valid: AttendancePreviewRow[];
  invalid: InvalidAttendanceRow[];
  totalProcessed: number;
}

export interface AttendanceUploadResponse {
  preview: AttendanceUploadPreview | null;
  parseErrors: Array<{ row: number; message?: string; error?: string }>;
}

export interface BulkAttendanceSubmitResponse {
  created: number;
  skipped: number;
  errors: Array<{ row: number; error: string }>;
}

// API Error
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
