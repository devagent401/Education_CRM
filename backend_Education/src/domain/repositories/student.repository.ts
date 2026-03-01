import type { Student, CreateStudentInput } from '../entities';

export interface StudentFilters {
  status?: Student['status'];
  guardianId?: string;
  classId?: string;
  shift?: string;
  batch?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedStudents {
  data: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IStudentRepository {
  findById(id: string): Promise<Student | null>;
  findByInstitutionAndRoll(institutionId: string, rollNumber: string): Promise<Student | null>;
  findByInstitutionAndStudentId(institutionId: string, studentId: string): Promise<Student | null>;
  findManyByInstitution(institutionId: string, filters?: StudentFilters): Promise<Student[]>;
  findManyPaginated(institutionId: string, filters: StudentFilters): Promise<PaginatedStudents>;
  create(data: CreateStudentInput): Promise<Student>;
  update(id: string, data: Partial<Student>): Promise<Student>;
  softDelete(id: string): Promise<void>;
}
