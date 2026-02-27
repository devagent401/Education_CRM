// Backend API types

export interface LoginRequest {
  institutionId: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface CreateInstitutionRequest {
  name: string;
  code: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
}
