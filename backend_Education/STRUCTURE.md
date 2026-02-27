# Folder Structure - Clean Architecture

```
src/
├── domain/                          # Pure domain, no framework deps
│   ├── entities/
│   │   ├── index.ts
│   │   ├── institution.entity.ts
│   │   ├── user.entity.ts
│   │   ├── student.entity.ts
│   │   ├── guardian.entity.ts
│   │   ├── attendance.entity.ts
│   │   ├── academic-structure.entity.ts
│   │   └── id-card.entity.ts
│   └── repositories/                # Ports (interfaces)
│       ├── index.ts
│       ├── institution.repository.ts
│       ├── user.repository.ts
│       ├── student.repository.ts
│       └── attendance.repository.ts
│
├── application/                      # Use cases
│   ├── auth/use-cases/
│   │   └── login.use-case.ts
│   ├── institution/use-cases/
│   │   └── create-institution.use-case.ts
│   └── attendance/use-cases/
│       ├── record-attendance.use-case.ts
│       └── bulk-attendance.use-case.ts
│
├── infrastructure/
│   ├── persistence/
│   │   ├── prisma/
│   │   │   └── prisma.service.ts
│   │   ├── repositories/            # Adapters
│   │   │   ├── institution.prisma.repository.ts
│   │   │   ├── user.prisma.repository.ts
│   │   │   ├── student.prisma.repository.ts
│   │   │   └── attendance.prisma.repository.ts
│   │   └── persistence.module.ts
│   ├── parsers/
│   │   ├── csv-attendance.parser.ts
│   │   └── excel-attendance.parser.ts
│   └── ocr/
│       └── image-attendance.parser.ts
│
├── presentation/
│   ├── auth/dto/
│   │   └── login.dto.ts
│   ├── attendance/
│   │   ├── dto/attendance.dto.ts
│   │   └── attendance.controller.ts
│   ├── institution/
│   │   └── institution.controller.ts
│   └── common/guards/
│       ├── institution.guard.ts
│       └── roles.guard.ts
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   └── auth.service.ts
│
├── institution/
│   └── institution.module.ts
│
├── attendance/
│   └── attendance.module.ts
│
├── app.module.ts
└── main.ts
```
