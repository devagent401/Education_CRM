# Backend API Map & Frontend Integration

## Backend API Endpoints

### Auth
| Method | Path | Body | Headers | Response | Frontend |
|--------|------|------|---------|----------|----------|
| POST | `/auth/login` | `{ institutionId, email, password }` | — | `{ accessToken, refreshToken, expiresIn, user }` | Login page, `useLogin` |

### Institution
| Method | Path | Body | Headers | Response | Frontend |
|--------|------|------|---------|----------|----------|
| POST | `/institution` | `{ name, code, slug, email, phone?, address? }` | — | Institution | Register page, `useCreateInstitution` |

### Attendance
| Method | Path | Body | Headers | Response | Frontend |
|--------|------|------|---------|----------|----------|
| POST | `/attendance/record` | `{ studentId, date, status, remarks? }` | `x-institution-id` | AttendanceRecord | Attendance page, `useRecordAttendance` |
| POST | `/attendance/upload/csv` | `FormData: file, date` | `x-institution-id` | `{ preview, parseErrors }` | Attendance page, `useAttendanceUpload` |
| POST | `/attendance/upload/csv/submit` | `FormData: file, date` | `x-institution-id` | `{ created, skipped, errors }` | Attendance page, `useAttendanceUpload` |
| POST | `/attendance/upload/excel` | `FormData: file, date` | `x-institution-id` | `{ preview, parseErrors }` | Attendance page, `useAttendanceUpload` |
| POST | `/attendance/upload/image` | `FormData: file, date` | `x-institution-id` | `{ preview, parseErrors }` | Attendance page, `useAttendanceUpload` |

## Frontend Architecture

### API Client
- Base URL: `NEXT_PUBLIC_API_URL` or `http://localhost:3000`
- Auth: Bearer token + `x-institution-id` header (from store/localStorage)

### Service Layer (`lib/api/services/`)
- `auth.service.ts` — login
- `institution.service.ts` — create institution
- `attendance.service.ts` — record, upload CSV/Excel/Image, submit CSV

### Hooks (`lib/hooks/`)
- `useLogin` — login with loading, error, success
- `useCreateInstitution` — create institution
- `useRecordAttendance` — manual attendance record
- `useAttendanceUpload` — bulk upload preview & submit

### Pages
- **Login** — institutionId, email, password
- **Register** — create institution form
- **Attendance** — manual entry + CSV/Excel/Image upload
- **Settings** — institution ID for demo/testing
- **Students, Teachers, Exams, Fees** — empty states (no backend APIs yet)
