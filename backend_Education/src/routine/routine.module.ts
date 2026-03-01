import { Module } from '@nestjs/common';
import { RoutineController } from '../presentation/routine/routine.controller';
import { CreateRoutineUseCase } from '../application/routine/use-cases/create-routine.use-case';
import { ListRoutinesUseCase } from '../application/routine/use-cases/list-routines.use-case';
import { GetRoutineUseCase } from '../application/routine/use-cases/get-routine.use-case';
import { UpdateRoutineUseCase } from '../application/routine/use-cases/update-routine.use-case';
import { DeleteRoutineUseCase } from '../application/routine/use-cases/delete-routine.use-case';

@Module({
  controllers: [RoutineController],
  providers: [
    CreateRoutineUseCase,
    ListRoutinesUseCase,
    GetRoutineUseCase,
    UpdateRoutineUseCase,
    DeleteRoutineUseCase,
  ],
})
export class RoutineModule {}
