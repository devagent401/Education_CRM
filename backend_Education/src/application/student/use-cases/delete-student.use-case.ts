import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../../domain/repositories';

@Injectable()
export class DeleteStudentUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const existing = await this.studentRepository.findById(id);
    if (!existing) throw new NotFoundException('Student not found');
    await this.studentRepository.softDelete(id);
    return { message: 'Student deleted successfully' };
  }
}
