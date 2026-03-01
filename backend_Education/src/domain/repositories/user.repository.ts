import type { User } from '../entities';

export interface UserWithInstitution extends User {
  institution: { id: string; name: string; code: string; slug: string; logoUrl?: string };
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(institutionId: string, email: string): Promise<User | null>;
  findByEmailGlobal(email: string): Promise<UserWithInstitution | null>;
  create(data: CreateUserInput): Promise<User>;
  updateLastLogin(id: string): Promise<void>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
}

export interface CreateUserInput {
  institutionId: string;
  email: string;
  password: string;
  name: string;
  role: User['role'];
  phone?: string;
}
