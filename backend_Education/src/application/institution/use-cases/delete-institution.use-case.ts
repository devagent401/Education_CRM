import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IInstitutionRepository } from '../../../domain/repositories';

@Injectable()
export class DeleteInstitutionUseCase {
  constructor(
    @Inject('IInstitutionRepository')
    private readonly institutionRepository: IInstitutionRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const existing = await this.institutionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Institution not found');
    }
    await this.institutionRepository.softDelete(id);
    return { message: 'Institution deleted successfully' };
  }
}
