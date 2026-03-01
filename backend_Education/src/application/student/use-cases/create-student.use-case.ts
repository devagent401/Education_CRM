import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type { IStudentRepository, IInstitutionRepository } from '../../../domain/repositories';
import type { Student, CreateStudentInput } from '../../../domain/entities';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly studentRepository: IStudentRepository,
    @Inject('IInstitutionRepository')
    private readonly institutionRepository: IInstitutionRepository,
  ) {}

  async execute(input: CreateStudentInput): Promise<Student> {
    const institution = await this.institutionRepository.findById(input.institutionId);
    if (!institution) throw new ConflictException('Institution not found');

    const existingRoll = await this.studentRepository.findByInstitutionAndRoll(
      input.institutionId,
      input.rollNumber,
    );
    if (existingRoll) throw new ConflictException('Roll number already exists');

    const existingId = await this.studentRepository.findByInstitutionAndStudentId(
      input.institutionId,
      input.studentId,
    );
    if (existingId) throw new ConflictException('Student ID already exists');

    return this.studentRepository.create(input);
  }
}
