# Educational Institution Management System

Production-ready, multi-tenant SaaS for educational institutions built with NestJS, PostgreSQL, and Prisma.

## Features

- **Multi-tenant** – Every request scoped by `institution_id`
- **Clean Architecture** – Domain, Application, Infrastructure, Presentation
- **Dynamic Schema** – No hardcoded class/subject structures
- **RBAC** – Roles: SuperAdmin, InstitutionAdmin, Teacher, Student, Guardian
- **Attendance** – Manual, CSV, Excel, Image OCR upload with validation & preview

## Quick Start

```bash
cp .env.example .env
# Edit .env with your PostgreSQL URL

npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

## Project Structure (Clean Architecture)

```
src/
├── domain/           # Entities, repository interfaces (ports)
├── application/     # Use cases (business logic)
├── infrastructure/   # Prisma, parsers, OCR
├── presentation/    # Controllers, DTOs, guards
├── auth/
├── institution/
├── attendance/
└── main.ts
```

## API Usage

### Auth

```
POST /auth/login
{
  "institutionId": "uuid",
  "email": "admin@school.com",
  "password": "SecurePass123"
}
```

### Attendance

Include `x-institution-id` header on all attendance requests.

- `POST /attendance/record` – Manual single record
- `POST /attendance/upload/csv` – Preview CSV upload
- `POST /attendance/upload/csv/submit` – Submit CSV
- `POST /attendance/upload/excel` – Preview Excel upload
- `POST /attendance/upload/image` – OCR-based image upload
