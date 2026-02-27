# Backend Integration

This client_Education portal integrates with the **backend_Education** NestJS API.

## Setup

1. Start the backend: `cd backend_Education && npm run start:dev`
2. Create `.env.local` in client_Education:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
3. Start the frontend: `cd client_Education && npm run dev`

## Integrated APIs

| Endpoint | Usage |
|----------|-------|
| POST `/auth/login` | Admin login (institutionId, email, password) |
| POST `/institution` | Create institution (Register page) |
| POST `/attendance/record` | Manual attendance (Dashboard → Attendance) |
| POST `/attendance/upload/csv` | CSV attendance upload (service ready) |

## Services

- `services/auth.service.ts` — login
- `services/institution.service.ts` — create institution
- `services/attendance.service.ts` — record, upload CSV

## Auth Flow

1. **Register**: Create institution → stores institution ID → redirects to login with ID prefilled
2. **Login**: Calls `/auth/login` → stores token + user + institutionId in zustand + localStorage
3. **Attendance**: Requires institutionId (from login). Sends `x-institution-id` header.

## API Client

`lib/api/client.ts` — Base fetch wrapper that:
- Adds `Authorization: Bearer <token>` when authenticated
- Adds `x-institution-id` header when institution context exists
- Parses error responses from backend
