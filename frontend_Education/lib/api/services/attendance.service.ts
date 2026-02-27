import { apiFetch } from "../client";
import type {
  RecordAttendanceRequest,
  AttendanceRecord,
  AttendanceUploadResponse,
  BulkAttendanceSubmitResponse,
} from "../types";

const ATTENDANCE_ENDPOINTS = {
  record: "/attendance/record",
  uploadCsv: "/attendance/upload/csv",
  submitCsv: "/attendance/upload/csv/submit",
  uploadExcel: "/attendance/upload/excel",
  uploadImage: "/attendance/upload/image",
} as const;

export const attendanceService = {
  record(
    body: RecordAttendanceRequest,
    institutionId: string
  ): Promise<AttendanceRecord> {
    return apiFetch<AttendanceRecord>(ATTENDANCE_ENDPOINTS.record, {
      method: "POST",
      body,
      institutionId,
    });
  },

  uploadCsv(
    file: File,
    date: string,
    institutionId: string
  ): Promise<AttendanceUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", date);
    return apiFetch<AttendanceUploadResponse>(ATTENDANCE_ENDPOINTS.uploadCsv, {
      method: "POST",
      body: formData,
      institutionId,
    });
  },

  submitCsv(
    file: File,
    date: string,
    institutionId: string
  ): Promise<BulkAttendanceSubmitResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", date);
    return apiFetch<BulkAttendanceSubmitResponse>(
      ATTENDANCE_ENDPOINTS.submitCsv,
      {
        method: "POST",
        body: formData,
        institutionId,
      }
    );
  },

  uploadExcel(
    file: File,
    date: string,
    institutionId: string
  ): Promise<AttendanceUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", date);
    return apiFetch<AttendanceUploadResponse>(
      ATTENDANCE_ENDPOINTS.uploadExcel,
      {
        method: "POST",
        body: formData,
        institutionId,
      }
    );
  },

  uploadImage(
    file: File,
    date: string,
    institutionId: string
  ): Promise<AttendanceUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", date);
    return apiFetch<AttendanceUploadResponse>(
      ATTENDANCE_ENDPOINTS.uploadImage,
      {
        method: "POST",
        body: formData,
        institutionId,
      }
    );
  },
};
