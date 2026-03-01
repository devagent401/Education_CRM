import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../../domain/repositories';
import type { Student } from '../../../domain/entities';

@Injectable()
export class UpdateStudentUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute(id: string, data: Partial<Student>): Promise<Student> {
    const existing = await this.studentRepository.findById(id);
    if (!existing) throw new NotFoundException('Student not found');
    return this.studentRepository.update(id, data);
  }
}
