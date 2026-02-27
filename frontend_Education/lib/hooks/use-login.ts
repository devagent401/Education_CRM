import { useState, useCallback } from "react";
import { authService } from "@/lib/api/services/auth.service";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { ApiClientError } from "@/lib/api/client";
import type { LoginRequest } from "@/lib/api/types";

interface UseLoginState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

interface UseLoginReturn extends UseLoginState {
  login: (data: LoginRequest) => Promise<void>;
  reset: () => void;
}

export function useLogin(): UseLoginReturn {
  const [state, setState] = useState<UseLoginState>({
    isLoading: false,
    error: null,
    success: false,
  });
  const setAuth = useAuthStore((s) => s.setAuth);

  const login = useCallback(
    async (data: LoginRequest) => {
      setState({ isLoading: true, error: null, success: false });
      try {
        const response = await authService.login(data);
        setAuth({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
          user: response.user,
          institutionId: data.institutionId,
        });
        setState({ isLoading: false, error: null, success: true });
      } catch (err) {
        const message =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Login failed. Please try again.";
        setState({ isLoading: false, error: message, success: false });
        throw err;
      }
    },
    [setAuth]
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, success: false });
  }, []);

  return { ...state, login, reset };
}
