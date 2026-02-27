import { create } from "zustand";

export type UserRole = "admin" | "teacher" | "student" | "staff";

export interface Institution {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
}

interface InstitutionState {
  institution: Institution | null;
  userRole: UserRole | null;
  setInstitution: (institution: Institution | null) => void;
  setUserRole: (role: UserRole | null) => void;
}

export const useInstitutionStore = create<InstitutionState>((set) => ({
  institution: null,
  userRole: null,
  setInstitution: (institution) => set({ institution }),
  setUserRole: (userRole) => set({ userRole }),
}));
