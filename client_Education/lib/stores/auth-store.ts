"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  institutionId: string | null;
  setInstitutionId: (id: string | null) => void;
  setAuth: (data: {
    accessToken: string;
    user: AuthUser;
    institutionId: string;
  }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      institutionId: null,
      setInstitutionId: (id) => {
        if (typeof window !== "undefined" && id) {
          localStorage.setItem("institutionId", id);
        } else if (typeof window !== "undefined") {
          localStorage.removeItem("institutionId");
        }
        set({ institutionId: id });
      },
      setAuth: (data) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("institutionId", data.institutionId);
        }
        set({
          accessToken: data.accessToken,
          user: data.user,
          institutionId: data.institutionId,
        });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("institutionId");
        }
        set({ accessToken: null, user: null, institutionId: null });
      },
      isAuthenticated: () =>
        !!(
          get().accessToken &&
          get().user &&
          get().institutionId
        ),
    }),
    { name: "auth" }
  )
);
