"use client";

import { useState, useCallback } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ApiError } from "@/lib/api/client";
import type { LoginRequest } from "@/lib/api/types";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);

  const login = useCallback(
    async (data: LoginRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authService.login(data);
        setAuth({
          accessToken: res.accessToken,
          user: res.user,
          institutionId: data.institutionId,
        });
      } catch (err) {
        const msg =
          err instanceof ApiError ? err.message : "Login failed. Try again.";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth]
  );

  return { login, isLoading, error };
}
