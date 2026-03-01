import { Module } from '@nestjs/common';
import { ClassController } from '../presentation/class/class.controller';
import { CreateClassUseCase } from '../application/class/use-cases/create-class.use-case';
import { ListClassesUseCase } from '../application/class/use-cases/list-classes.use-case';
import { GetClassUseCase } from '../application/class/use-cases/get-class.use-case';
import { UpdateClassUseCase } from '../application/class/use-cases/update-class.use-case';
import { DeleteClassUseCase } from '../application/class/use-cases/delete-class.use-case';

@Module({
  controllers: [ClassController],
  providers: [
    CreateClassUseCase,
    ListClassesUseCase,
    GetClassUseCase,
    UpdateClassUseCase,
    DeleteClassUseCase,
  ],
})
export class ClassModule {}
