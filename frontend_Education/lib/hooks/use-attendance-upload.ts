import { useState, useCallback } from "react";
import { attendanceService } from "@/lib/api/services/attendance.service";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { ApiClientError } from "@/lib/api/client";
import type {
  AttendanceUploadResponse,
  BulkAttendanceSubmitResponse,
} from "@/lib/api/types";

type UploadType = "csv" | "excel" | "image";

interface UseAttendanceUploadState {
  isLoading: boolean;
  error: string | null;
  preview: AttendanceUploadResponse | null;
  submitResult: BulkAttendanceSubmitResponse | null;
}

interface UseAttendanceUploadReturn extends UseAttendanceUploadState {
  upload: (
    file: File,
    date: string,
    type: UploadType
  ) => Promise<AttendanceUploadResponse>;
  submitCsv: (file: File, date: string) => Promise<BulkAttendanceSubmitResponse>;
  reset: () => void;
}

export function useAttendanceUpload(): UseAttendanceUploadReturn {
  const [state, setState] = useState<UseAttendanceUploadState>({
    isLoading: false,
    error: null,
    preview: null,
    submitResult: null,
  });
  const institutionId = useAuthStore((s) => s.institutionId);

  const requireInstitution = useCallback(() => {
    if (!institutionId) {
      throw new Error("Institution context required. Please log in.");
    }
  }, [institutionId]);

  const upload = useCallback(
    async (file: File, date: string, type: UploadType) => {
      requireInstitution();
      setState({ isLoading: true, error: null, preview: null, submitResult: null });
      try {
        let result: AttendanceUploadResponse;
        switch (type) {
          case "csv":
            result = await attendanceService.uploadCsv(
              file,
              date,
              institutionId!
            );
            break;
          case "excel":
            result = await attendanceService.uploadExcel(
              file,
              date,
              institutionId!
            );
            break;
          case "image":
            result = await attendanceService.uploadImage(
              file,
              date,
              institutionId!
            );
            break;
          default:
            throw new Error(`Unknown upload type: ${type}`);
        }
        setState({
          isLoading: false,
          error: null,
          preview: result,
          submitResult: null,
        });
        return result;
      } catch (err) {
        const message =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Upload failed.";
        setState({
          isLoading: false,
          error: message,
          preview: null,
          submitResult: null,
        });
        throw err;
      }
    },
    [institutionId, requireInstitution]
  );

  const submitCsv = useCallback(
    async (file: File, date: string) => {
      requireInstitution();
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const result = await attendanceService.submitCsv(
          file,
          date,
          institutionId!
        );
        setState((s) => ({
          ...s,
          isLoading: false,
          error: null,
          submitResult: result,
        }));
        return result;
      } catch (err) {
        const message =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Submit failed.";
        setState((s) => ({
          ...s,
          isLoading: false,
          error: message,
        }));
        throw err;
      }
    },
    [institutionId, requireInstitution]
  );

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      preview: null,
      submitResult: null,
    });
  }, []);

  return { ...state, upload, submitCsv, reset };
}
