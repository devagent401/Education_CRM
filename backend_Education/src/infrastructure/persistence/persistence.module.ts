import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { InstitutionPrismaRepository } from './repositories/institution.prisma.repository';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { StudentPrismaRepository } from './repositories/student.prisma.repository';
import { AttendancePrismaRepository } from './repositories/attendance.prisma.repository';

import type { IInstitutionRepository } from '../../domain/repositories';
import type { IUserRepository } from '../../domain/repositories';
import type { IStudentRepository } from '../../domain/repositories';
import type { IAttendanceRepository } from '../../domain/repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'IInstitutionRepository',
      useClass: InstitutionPrismaRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserPrismaRepository,
    },
    {
      provide: 'IStudentRepository',
      useClass: StudentPrismaRepository,
    },
    {
      provide: 'IAttendanceRepository',
      useClass: AttendancePrismaRepository,
    },
  ],
  exports: [
    PrismaService,
    'IInstitutionRepository',
    'IUserRepository',
    'IStudentRepository',
    'IAttendanceRepository',
  ],
})
export class PersistenceModule {}
