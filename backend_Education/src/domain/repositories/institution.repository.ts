import type { Institution, CreateInstitutionInput } from '../entities';

export interface InstitutionFilters {
  search?: string;
  status?: Institution['status'];
  page?: number;
  limit?: number;
}

export interface PaginatedInstitutions {
  data: Institution[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IInstitutionRepository {
  create(data: CreateInstitutionInput): Promise<Institution>;
  findById(id: string): Promise<Institution | null>;
  findByCode(code: string): Promise<Institution | null>;
  findBySlug(slug: string): Promise<Institution | null>;
  findMany(filters: InstitutionFilters): Promise<PaginatedInstitutions>;
  update(id: string, data: Partial<Institution>): Promise<Institution>;
  softDelete(id: string): Promise<void>;
}
