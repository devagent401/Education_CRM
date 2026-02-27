import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { IInstitutionRepository } from '../../../domain/repositories';
import type { Institution, CreateInstitutionInput } from '../../../domain/entities';

@Injectable()
export class InstitutionPrismaRepository implements IInstitutionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateInstitutionInput): Promise<Institution> {
    const row = await this.prisma.institution.create({
      data: {
        name: data.name,
        code: data.code,
        slug: data.slug,
        email: data.email,
        phone: data.phone,
        address: data.address,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
      },
    });
    return this.toDomain(row);
  }

  async findById(id: string): Promise<Institution | null> {
    const row = await this.prisma.institution.findUnique({
      where: { id, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByCode(code: string): Promise<Institution | null> {
    const row = await this.prisma.institution.findUnique({
      where: { code, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Institution | null> {
    const row = await this.prisma.institution.findUnique({
      where: { slug, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async update(id: string, data: Partial<Institution>): Promise<Institution> {
    const row = await this.prisma.institution.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.primaryColor && { primaryColor: data.primaryColor }),
        ...(data.secondaryColor && { secondaryColor: data.secondaryColor }),
        ...(data.status && { status: data.status as any }),
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    name: string;
    code: string;
    slug: string;
    email: string;
    phone: string | null;
    address: string | null;
    logoUrl: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): Institution {
    return {
      id: row.id,
      name: row.name,
      code: row.code,
      slug: row.slug,
      email: row.email,
      phone: row.phone ?? undefined,
      address: row.address ?? undefined,
      logoUrl: row.logoUrl ?? undefined,
      primaryColor: row.primaryColor ?? undefined,
      secondaryColor: row.secondaryColor ?? undefined,
      status: row.status as Institution['status'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    };
  }
}
