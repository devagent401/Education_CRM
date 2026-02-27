import { apiFetch } from "@/lib/api/client";

const INSTITUTION_ID_HEADER = "x-institution-id";

export interface RecordAttendancePayload {
  studentId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | "LEAVE";
  remarks?: string;
}

export const attendanceService = {
  record(payload: RecordAttendancePayload, institutionId: string) {
    return apiFetch("/attendance/record", {
      method: "POST",
      body: payload,
      institutionId,
    });
  },
  uploadCsv(file: File, date: string, institutionId: string) {
    const form = new FormData();
    form.append("file", file);
    form.append("date", date);
    return apiFetch<{ preview: unknown; parseErrors: unknown[] }>(
      "/attendance/upload/csv",
      {
        method: "POST",
        body: form,
        institutionId,
      }
    );
  },
};
