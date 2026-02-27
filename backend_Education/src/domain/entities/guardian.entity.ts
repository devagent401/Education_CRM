/**
 * Guardian - Domain Entity
 * Pure domain model, no framework dependencies
 */
export interface Guardian {
  id: string;
  institutionId: string;
  name: string;
  email?: string;
  phone: string;
  relation: string;
  address?: string;
  occupation?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
