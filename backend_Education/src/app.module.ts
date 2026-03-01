import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { InstitutionModule } from './institution/institution.module';
import { AttendanceModule } from './attendance/attendance.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { RoutineModule } from './routine/routine.module';
import { PaymentModule } from './payment/payment.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PersistenceModule,
    AuthModule,
    InstitutionModule,
    AttendanceModule,
    StudentModule,
    TeacherModule,
    ClassModule,
    RoutineModule,
    PaymentModule,
  ],
})
export class AppModule { }
