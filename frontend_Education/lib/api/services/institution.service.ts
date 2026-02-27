import { apiFetch } from "../client";
import type { CreateInstitutionRequest, Institution } from "../types";

const INSTITUTION_ENDPOINTS = {
  create: "/institution",
} as const;

export const institutionService = {
  create(body: CreateInstitutionRequest): Promise<Institution> {
    return apiFetch<Institution>(INSTITUTION_ENDPOINTS.create, {
      method: "POST",
      body,
      skipAuth: true,
    });
  },
};
