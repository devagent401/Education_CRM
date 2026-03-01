/**
 * User - Domain Entity
 * Pure domain model, no framework dependencies
 */
export type UserRole =
  | 'SUPER_ADMIN'
  | 'INSTITUTION_ADMIN'
  | 'TEACHER'
  | 'STUDENT'
  | 'GUARDIAN'
  | 'ACCOUNTANT';

export interface User {
  id: string;
  institutionId: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AuthenticatedUser extends User {
  permissions: string[];
}
