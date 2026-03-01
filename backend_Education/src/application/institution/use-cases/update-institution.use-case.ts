import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IInstitutionRepository } from '../../../domain/repositories';
import type { Institution } from '../../../domain/entities';

export interface UpdateInstitutionInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  footerText?: string;
  tagline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  socialLinks?: Record<string, string>;
  status?: Institution['status'];
}

@Injectable()
export class UpdateInstitutionUseCase {
  constructor(
    @Inject('IInstitutionRepository')
    private readonly institutionRepository: IInstitutionRepository,
  ) {}

  async execute(id: string, data: UpdateInstitutionInput): Promise<Institution> {
    const existing = await this.institutionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Institution not found');
    }
    return this.institutionRepository.update(id, data);
  }
}
