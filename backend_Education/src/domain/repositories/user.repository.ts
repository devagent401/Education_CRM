import type { User } from '../entities';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(institutionId: string, email: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
}

export interface CreateUserInput {
  institutionId: string;
  email: string;
  password: string;
  name: string;
  role: User['role'];
  phone?: string;
}
