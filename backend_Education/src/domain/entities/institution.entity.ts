/**
 * Institution - Domain Entity
 * Pure domain model, no framework dependencies
 */
export type InstitutionStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL';

export interface Institution {
  id: string;
  name: string;
  code: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  status: InstitutionStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateInstitutionInput {
  name: string;
  code: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}
