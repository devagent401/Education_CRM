import { Injectable, Inject } from '@nestjs/common';
import type {
  IInstitutionRepository,
  InstitutionFilters,
  PaginatedInstitutions,
} from '../../../domain/repositories';

@Injectable()
export class ListInstitutionsUseCase {
  constructor(
    @Inject('IInstitutionRepository')
    private readonly institutionRepository: IInstitutionRepository,
  ) {}

  async execute(filters: InstitutionFilters): Promise<PaginatedInstitutions> {
    return this.institutionRepository.findMany(filters);
  }
}
