import type { Institution, CreateInstitutionInput } from '../entities';

export interface IInstitutionRepository {
  create(data: CreateInstitutionInput): Promise<Institution>;
  findById(id: string): Promise<Institution | null>;
  findByCode(code: string): Promise<Institution | null>;
  findBySlug(slug: string): Promise<Institution | null>;
  update(id: string, data: Partial<Institution>): Promise<Institution>;
}
