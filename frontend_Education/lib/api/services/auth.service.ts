import { apiFetch } from "../client";
import type { LoginRequest, LoginResponse } from "../types";

const AUTH_ENDPOINTS = {
  login: "/auth/login",
} as const;

export const authService = {
  login(body: LoginRequest): Promise<LoginResponse> {
    return apiFetch<LoginResponse>(AUTH_ENDPOINTS.login, {
      method: "POST",
      body,
      skipAuth: true,
    });
  },
};
