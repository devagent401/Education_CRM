import { apiFetch } from "@/lib/api/client";
import type { CreateInstitutionRequest, Institution } from "@/lib/api/types";

export const institutionService = {
  create(body: CreateInstitutionRequest): Promise<Institution> {
    return apiFetch<Institution>("/institution", {
      method: "POST",
      body,
      skipAuth: true,
    });
  },
};
