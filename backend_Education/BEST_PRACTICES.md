# Best Practices – Educational Institution Management System

## 1. Multi-Tenancy

- **Every table** includes `institution_id` for tenant scoping
- **InstitutionGuard** enforces `x-institution-id` header on protected routes
- All queries must filter by `institutionId` to prevent cross-tenant data leakage

## 2. Clean Architecture Layers

| Layer | Responsibility | Dependencies |
|-------|----------------|---------------|
| **Domain** | Entities, ports (interfaces) | None |
| **Application** | Use cases, orchestration | Domain only |
| **Infrastructure** | DB, parsers, OCR, external APIs | Domain, Application (via ports) |
| **Presentation** | Controllers, DTOs, guards | Application (use cases) |

- **Domain entities** are framework-agnostic; no NestJS or Prisma imports
- **Business logic** lives in Use Cases, not controllers or services
- **Controllers** are thin: validate input → call use case → return response

## 3. SOLID & DRY

- **Single Responsibility**: Each use case handles one flow (e.g. `RecordAttendanceUseCase`, `BulkAttendanceUseCase`)
- **Dependency Inversion**: Use cases depend on repository interfaces, not concrete implementations
- **Open/Closed**: New parsers (e.g. Google Sheets) can be added without changing use cases

## 4. Validation at Boundaries

- DTOs use `class-validator` for request validation
- Parsers (CSV, Excel, Image) validate and return structured errors
- `validateAndPreview` in `BulkAttendanceUseCase` ensures data integrity before bulk insert

## 5. Attendance Upload Flow

```
Upload → Parse → Validate & Preview → User Confirms → Submit
```

1. **Preview** endpoints return valid/invalid rows for user review
2. **Submit** endpoints persist only valid rows and report errors
3. **Auto-detect** student by roll_number or student_id
4. **Audit logs** track source (MANUAL, CSV, EXCEL, IMAGE_OCR)

## 6. Database Conventions

- UUIDs for all primary keys
- `created_at`, `updated_at` on every table
- `deleted_at` for soft delete where applicable
- Compound unique constraints for attendance (institution + student + date)

## 7. Security

- JWT + refresh token auth
- Passwords hashed with bcrypt
- RBAC via `RolesGuard` and `@Roles()` decorator
- Institution scope verified on every request
