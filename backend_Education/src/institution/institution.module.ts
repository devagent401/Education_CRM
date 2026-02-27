import { Module } from '@nestjs/common';
import { InstitutionController } from '../presentation/institution/institution.controller';
import { CreateInstitutionUseCase } from '../application/institution/use-cases/create-institution.use-case';

@Module({
  controllers: [InstitutionController],
  providers: [CreateInstitutionUseCase],
})
export class InstitutionModule {}
