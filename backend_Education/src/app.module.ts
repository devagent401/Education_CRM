import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { InstitutionModule } from './institution/institution.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PersistenceModule,
    AuthModule,
    InstitutionModule,
    AttendanceModule,
  ],
})
export class AppModule {}
