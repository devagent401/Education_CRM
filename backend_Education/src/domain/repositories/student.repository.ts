import type { Student, CreateStudentInput } from '../entities';

export interface IStudentRepository {
  findById(id: string): Promise<Student | null>;
  findByInstitutionAndRoll(institutionId: string, rollNumber: string): Promise<Student | null>;
  findByInstitutionAndStudentId(institutionId: string, studentId: string): Promise<Student | null>;
  findManyByInstitution(institutionId: string, filters?: StudentFilters): Promise<Student[]>;
  create(data: CreateStudentInput): Promise<Student>;
}

export interface StudentFilters {
  status?: Student['status'];
  guardianId?: string;
}
