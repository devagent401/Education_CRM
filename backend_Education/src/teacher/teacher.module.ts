import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TeacherController } from '../presentation/teacher/teacher.controller';
import { CreateTeacherUseCase } from '../application/teacher/use-cases/create-teacher.use-case';
import { ListTeachersUseCase } from '../application/teacher/use-cases/list-teachers.use-case';
import { GetTeacherUseCase } from '../application/teacher/use-cases/get-teacher.use-case';
import { UpdateTeacherUseCase } from '../application/teacher/use-cases/update-teacher.use-case';
import { DeleteTeacherUseCase } from '../application/teacher/use-cases/delete-teacher.use-case';

@Module({
  imports: [AuthModule],
  controllers: [TeacherController],
  providers: [
    CreateTeacherUseCase,
    ListTeachersUseCase,
    GetTeacherUseCase,
    UpdateTeacherUseCase,
    DeleteTeacherUseCase,
  ],
})
export class TeacherModule {}
