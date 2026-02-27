import { useState, useCallback } from "react";
import { institutionService } from "@/lib/api/services/institution.service";
import { ApiClientError } from "@/lib/api/client";
import type { CreateInstitutionRequest, Institution } from "@/lib/api/types";

interface UseCreateInstitutionState {
  isLoading: boolean;
  error: string | null;
  data: Institution | null;
}

interface UseCreateInstitutionReturn extends UseCreateInstitutionState {
  createInstitution: (data: CreateInstitutionRequest) => Promise<Institution>;
  reset: () => void;
}

export function useCreateInstitution(): UseCreateInstitutionReturn {
  const [state, setState] = useState<UseCreateInstitutionState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const createInstitution = useCallback(
    async (data: CreateInstitutionRequest) => {
      setState({ isLoading: true, error: null, data: null });
      try {
        const result = await institutionService.create(data);
        setState({ isLoading: false, error: null, data: result });
        return result;
      } catch (err) {
        const message =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to create institution.";
        setState({ isLoading: false, error: message, data: null });
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
  }, []);

  return { ...state, createInstitution, reset };
}
