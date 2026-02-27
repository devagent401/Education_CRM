import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  user: AuthUser | null;
  institutionId: string | null;
  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: AuthUser;
    institutionId: string;
  }) => void;
  setInstitutionId: (id: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      user: null,
      institutionId: null,
      setAuth: (data) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("institutionId", data.institutionId);
        }
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn,
          user: data.user,
          institutionId: data.institutionId,
        });
      },
      setInstitutionId: (institutionId) => {
        if (typeof window !== "undefined" && institutionId) {
          localStorage.setItem("institutionId", institutionId);
        } else if (typeof window !== "undefined") {
          localStorage.removeItem("institutionId");
        }
        set({ institutionId });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("institutionId");
        }
        set({
          accessToken: null,
          refreshToken: null,
          expiresIn: null,
          user: null,
          institutionId: null,
        });
      },
      isAuthenticated: () => {
        const state = get();
        return !!(
          state.accessToken &&
          state.user &&
          state.institutionId
        );
      },
    }),
    { name: "auth-storage" }
  )
);
