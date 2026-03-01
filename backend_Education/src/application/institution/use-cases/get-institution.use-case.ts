import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IInstitutionRepository } from '../../../domain/repositories';
import type { Institution } from '../../../domain/entities';

@Injectable()
export class GetInstitutionUseCase {
  constructor(
    @Inject('IInstitutionRepository')
    private readonly institutionRepository: IInstitutionRepository,
  ) {}

  async execute(id: string): Promise<Institution> {
    const institution = await this.institutionRepository.findById(id);
    if (!institution) {
      throw new NotFoundException('Institution not found');
    }
    return institution;
  }
}
