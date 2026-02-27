/**
 * AcademicStructure - Domain Entity
 * Dynamic hierarchy (Grade, Section, Subject, etc.)
 */
export interface AcademicStructure {
  id: string;
  institutionId: string;
  name: string;
  code: string;
  level: number;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
