import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  IInstitutionRepository,
  InstitutionFilters,
  PaginatedInstitutions,
} from '../../../domain/repositories';
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
        website: data.website,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
        footerText: data.footerText,
        tagline: data.tagline,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        socialLinks: data.socialLinks as object | undefined,
      },
    });
    return this.toDomain(row);
  }

  async findById(id: string): Promise<Institution | null> {
    const row = await this.prisma.institution.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByCode(code: string): Promise<Institution | null> {
    const row = await this.prisma.institution.findFirst({
      where: { code, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Institution | null> {
    const row = await this.prisma.institution.findFirst({
      where: { slug, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findMany(filters: InstitutionFilters): Promise<PaginatedInstitutions> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.status) {
      where.status = filters.status;
    }

    const [data, total] = await Promise.all([
      this.prisma.institution.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.institution.count({ where }),
    ]);

    return {
      data: data.map((row) => this.toDomain(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.institution.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async update(id: string, data: Partial<Institution>): Promise<Institution> {
    const row = await this.prisma.institution.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.bannerUrl !== undefined && { bannerUrl: data.bannerUrl }),
        ...(data.footerText !== undefined && { footerText: data.footerText }),
        ...(data.tagline !== undefined && { tagline: data.tagline }),
        ...(data.socialLinks !== undefined && { socialLinks: data.socialLinks as object }),
        ...(data.primaryColor !== undefined && { primaryColor: data.primaryColor }),
        ...(data.secondaryColor !== undefined && { secondaryColor: data.secondaryColor }),
        ...(data.status !== undefined && { status: data.status as any }),
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
    website: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
    footerText: string | null;
    tagline: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
    socialLinks: unknown;
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
      website: row.website ?? undefined,
      logoUrl: row.logoUrl ?? undefined,
      bannerUrl: row.bannerUrl ?? undefined,
      footerText: row.footerText ?? undefined,
      tagline: row.tagline ?? undefined,
      primaryColor: row.primaryColor ?? undefined,
      secondaryColor: row.secondaryColor ?? undefined,
      socialLinks: (row.socialLinks as Record<string, string>) ?? undefined,
      status: row.status as Institution['status'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    };
  }
}
