import { Module } from '@nestjs/common';
import { InstitutionController } from '../presentation/institution/institution.controller';
import { CreateInstitutionUseCase } from '../application/institution/use-cases/create-institution.use-case';
import { ListInstitutionsUseCase } from '../application/institution/use-cases/list-institutions.use-case';
import { GetInstitutionUseCase } from '../application/institution/use-cases/get-institution.use-case';
import { UpdateInstitutionUseCase } from '../application/institution/use-cases/update-institution.use-case';
import { DeleteInstitutionUseCase } from '../application/institution/use-cases/delete-institution.use-case';

@Module({
  controllers: [InstitutionController],
  providers: [
    CreateInstitutionUseCase,
    ListInstitutionsUseCase,
    GetInstitutionUseCase,
    UpdateInstitutionUseCase,
    DeleteInstitutionUseCase,
  ],
})
export class InstitutionModule {}
