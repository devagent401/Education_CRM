import { useState, useCallback } from "react";
import { attendanceService } from "@/lib/api/services/attendance.service";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { ApiClientError } from "@/lib/api/client";
import type { RecordAttendanceRequest, AttendanceRecord } from "@/lib/api/types";

interface UseRecordAttendanceState {
  isLoading: boolean;
  error: string | null;
  data: AttendanceRecord | null;
}

interface UseRecordAttendanceReturn extends UseRecordAttendanceState {
  recordAttendance: (data: RecordAttendanceRequest) => Promise<AttendanceRecord>;
  reset: () => void;
}

export function useRecordAttendance(): UseRecordAttendanceReturn {
  const [state, setState] = useState<UseRecordAttendanceState>({
    isLoading: false,
    error: null,
    data: null,
  });
  const institutionId = useAuthStore((s) => s.institutionId);

  const recordAttendance = useCallback(
    async (data: RecordAttendanceRequest) => {
      if (!institutionId) {
        setState({
          isLoading: false,
          error: "Institution context required. Please log in.",
          data: null,
        });
        throw new Error("Institution context required");
      }
      setState({ isLoading: true, error: null, data: null });
      try {
        const result = await attendanceService.record(data, institutionId);
        setState({ isLoading: false, error: null, data: result });
        return result;
      } catch (err) {
        const message =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to record attendance.";
        setState({ isLoading: false, error: message, data: null });
        throw err;
      }
    },
    [institutionId]
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
  }, []);

  return { ...state, recordAttendance, reset };
}
