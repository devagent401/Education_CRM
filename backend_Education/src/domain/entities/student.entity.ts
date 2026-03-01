/**
 * Student - Domain Entity
 * Pure domain model, no framework dependencies
 */
export type StudentStatus = 'ACTIVE' | 'PASSED' | 'DROPOUT' | 'TRANSFERRED';

export interface Student {
  id: string;
  institutionId: string;
  rollNumber: string;
  studentId: string;
  name: string;
  dateOfBirth?: Date;
  gender?: string;
  guardianId?: string;
  classId?: string;
  shift?: string;
  batch?: string;
  status: StudentStatus;
  admissionData?: Record<string, unknown>;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateStudentInput {
  institutionId: string;
  rollNumber: string;
  studentId: string;
  name: string;
  dateOfBirth?: Date;
  gender?: string;
  guardianId?: string;
  classId?: string;
  shift?: string;
  batch?: string;
  admissionData?: Record<string, unknown>;
}
