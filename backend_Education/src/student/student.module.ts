import { Module } from '@nestjs/common';
import { StudentController } from '../presentation/student/student.controller';
import { CreateStudentUseCase } from '../application/student/use-cases/create-student.use-case';
import { ListStudentsUseCase } from '../application/student/use-cases/list-students.use-case';
import { GetStudentUseCase } from '../application/student/use-cases/get-student.use-case';
import { UpdateStudentUseCase } from '../application/student/use-cases/update-student.use-case';
import { DeleteStudentUseCase } from '../application/student/use-cases/delete-student.use-case';

@Module({
  controllers: [StudentController],
  providers: [
    CreateStudentUseCase,
    ListStudentsUseCase,
    GetStudentUseCase,
    UpdateStudentUseCase,
    DeleteStudentUseCase,
  ],
})
export class StudentModule {}
