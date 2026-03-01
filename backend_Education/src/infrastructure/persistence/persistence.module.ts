import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AttendancePrismaRepository } from './repositories/attendance.prisma.repository';
import { InstitutionPrismaRepository } from './repositories/institution.prisma.repository';
import { StudentPrismaRepository } from './repositories/student.prisma.repository';
import { UserPrismaRepository } from './repositories/user.prisma.repository';


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
export class PersistenceModule { }
