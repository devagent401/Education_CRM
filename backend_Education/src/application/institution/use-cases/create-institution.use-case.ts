import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type { IInstitutionRepository } from '../../../domain/repositories';
import type { Institution, CreateInstitutionInput } from '../../../domain/entities';

@Injectable()
export class CreateInstitutionUseCase {
  constructor(
    @Inject('IInstitutionRepository')
    private readonly institutionRepository: IInstitutionRepository,
  ) {}

  async execute(input: CreateInstitutionInput): Promise<Institution> {
    const existingByCode = await this.institutionRepository.findByCode(
      input.code,
    );
    if (existingByCode) {
      throw new ConflictException(`Institution with code ${input.code} exists`);
    }

    const existingBySlug = await this.institutionRepository.findBySlug(
      input.slug,
    );
    if (existingBySlug) {
      throw new ConflictException(`Institution with slug ${input.slug} exists`);
    }

    return this.institutionRepository.create(input);
  }
}
