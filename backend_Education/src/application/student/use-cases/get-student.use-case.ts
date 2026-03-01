import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../../domain/repositories';
import type { Student } from '../../../domain/entities';

@Injectable()
export class GetStudentUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute(id: string): Promise<Student> {
    const student = await this.studentRepository.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }
}
