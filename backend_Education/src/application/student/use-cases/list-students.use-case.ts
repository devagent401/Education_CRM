import { Injectable, Inject } from '@nestjs/common';
import type { IStudentRepository, StudentFilters, PaginatedStudents } from '../../../domain/repositories';

@Injectable()
export class ListStudentsUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute(institutionId: string, filters: StudentFilters): Promise<PaginatedStudents> {
    return this.studentRepository.findManyPaginated(institutionId, filters);
  }
}
