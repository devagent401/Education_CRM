# Education CRM - Production-Ready API Architecture

## Overview

Multi-tenant Madrasah/School Management System built with NestJS, PostgreSQL, and Prisma.

## Tech Stack

- **Framework:** NestJS (latest)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI

## Architecture Layers

```
src/
├── domain/           # Entities, repository interfaces
├── application/      # Use cases (business logic)
├── infrastructure/   # Persistence, parsers, external services
├── presentation/     # Controllers, DTOs, guards
└── auth/             # Auth service, JWT
```

## Auth System

### Login (Fixed)
- **URL:** `POST /auth/login`
- **Payload:** `{ "email": "teacher@school.com", "password": "SecurePass123!" }`
- **No institutionId** - user found by email, institution auto-detected
- **Response:** accessToken, refreshToken, user, institution

### Roles
- SUPER_ADMIN (platform-level)
- INSTITUTION_ADMIN
- TEACHER
- STUDENT
- GUARDIAN
- ACCOUNTANT

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | User login (email + password) |
| POST | /auth/super-admin/login | Super Admin login |
| POST | /auth/register | Register user (requires institutionId) |
| POST | /auth/refresh | Refresh token (planned) |
| POST | /auth/logout | Logout (planned) |
| POST | /auth/forgot-password | Forgot password (planned) |
| PATCH | /auth/change-password | Change password (planned) |

## Multi-Tenancy

- All tenant data scoped by `institutionId`
- `x-institution-id` header for institution context
- JWT contains `institutionId` for institution users

## Database Schema

- UUID primary keys
- Soft delete (`deletedAt`)
- Foreign keys with cascade rules
- Indexes on `institutionId`, `email`, `slug`, `code`

## API Conventions

- **Pagination:** `?page=1&limit=20`
- **Filters:** `?status=ACTIVE&class=1`
- **Search:** `?search=john`
- **Date range:** `?from=2025-01-01&to=2025-01-31`

## CRUD Pattern (per module)

- POST /resource - Create
- GET /resource - List (paginated, filtered)
- GET /resource/:id - Get by ID
- PATCH /resource/:id - Update
- DELETE /resource/:id - Soft delete
