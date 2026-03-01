import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  IUserRepository,
  CreateUserInput,
  UserWithInstitution,
} from '../../../domain/repositories';
import type { User } from '../../../domain/entities';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmailGlobal(email: string): Promise<UserWithInstitution | null> {
    const row = await this.prisma.user.findFirst({
      where: {
        email: { equals: email.trim(), mode: 'insensitive' },
        deletedAt: null,
      },
      include: {
        institution: {
          select: { id: true, name: true, code: true, slug: true, logoUrl: true },
        },
      },
    });
    if (!row) return null;
    return {
      ...this.toDomain(row),
      institution: {
        ...row.institution,
        logoUrl: row.institution.logoUrl ?? undefined,
      },
    };
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(
    institutionId: string,
    email: string,
  ): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: {
        institutionId_email: { institutionId, email },
        deletedAt: null,
      },
    });
    return row ? this.toDomain(row) : null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const row = await this.prisma.user.create({
      data: {
        institutionId: data.institutionId,
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role as any,
        phone: data.phone,
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    institutionId: string;
    email: string;
    password: string;
    name: string;
    phone: string | null;
    role: string;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): User {
    return {
      id: row.id,
      institutionId: row.institutionId,
      email: row.email,
      password: row.password,
      name: row.name,
      phone: row.phone ?? undefined,
      role: row.role as User['role'],
      isActive: row.isActive,
      lastLoginAt: row.lastLoginAt ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    };
  }
}
