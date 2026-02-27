import { apiFetch } from "@/lib/api/client";
import type { LoginRequest, LoginResponse } from "@/lib/api/types";

export const authService = {
  login(body: LoginRequest): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body,
      skipAuth: true,
    });
  },
};
