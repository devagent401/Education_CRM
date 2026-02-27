import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSource,
} from '../entities';

export interface IAttendanceRepository {
  create(data: CreateAttendanceInput): Promise<AttendanceRecord>;
  createMany(data: CreateAttendanceInput[]): Promise<AttendanceRecord[]>;
  findByStudentAndDate(
    institutionId: string,
    studentId: string,
    date: Date,
  ): Promise<AttendanceRecord | null>;
  findByDateAndInstitution(
    institutionId: string,
    date: Date,
  ): Promise<AttendanceRecord[]>;
}

export interface CreateAttendanceInput {
  institutionId: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  recordedById?: string;
  source: AttendanceSource;
  sourceRef?: string;
}
