# Education CRM - API Endpoints Summary

## Base URL
`http://localhost:3000`

## Swagger Documentation
`http://localhost:3000/api/docs`

**All endpoints except Auth and Institution require:**
- `Authorization: Bearer <token>`
- `x-institution-id: <uuid>` (for institution-scoped modules)

---

## 1. Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/login | Public | User login (email + password, no institutionId) |
| POST | /auth/super-admin/login | Public | Super Admin login |
| POST | /auth/register | Public | Register user (requires institutionId) |
| POST | /auth/refresh | Public | Refresh access token |
| POST | /auth/logout | Public | Logout (revoke refresh token) |
| POST | /auth/forgot-password | Public | Request password reset |
| POST | /auth/reset-password | Public | Reset password with token |
| POST | /auth/change-password | Bearer | Change password (authenticated) |

### Login Payload (Fixed)
```json
{
  "email": "teacher@school.com",
  "password": "SecurePass123!"
}
```

### Login Response
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 3600,
  "user": { "id", "email", "name", "role" },
  "institution": { "id", "name", "code", "slug", "logoUrl" }
}
```

---

## 2. Institution

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /institution | Public | Create institution |
| GET | /institution | Public | List (paginated, ?search=&status=&page=&limit=) |
| GET | /institution/:id | Public | Get by ID |
| PATCH | /institution/:id | Public | Update (name, logo, banner, footer, etc.) |
| DELETE | /institution/:id | Public | Soft delete |

---

## 3. Student

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /student | Create student |
| GET | /student | List (paginated, ?search=&status=&classId=&shift=&batch=&page=&limit=) |
| GET | /student/:id | Get by ID |
| PATCH | /student/:id | Update |
| DELETE | /student/:id | Soft delete |

---

## 4. Teacher

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /teacher | Create teacher |
| GET | /teacher | List (paginated, ?search=&department=&page=&limit=) |
| GET | /teacher/:id | Get by ID |
| PATCH | /teacher/:id | Update |
| DELETE | /teacher/:id | Delete |

---

## 5. Class (Academic Structure)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /class | Create class/section/shift |
| GET | /class | List (?level=&parentId=&search=&page=&limit=) |
| GET | /class/:id | Get by ID |
| PATCH | /class/:id | Update |
| DELETE | /class/:id | Delete |

---

## 6. Routine (Class Timetable)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /routine | Create routine |
| GET | /routine | List (?classId=&teacherId=&dayOfWeek=&academicYear=) |
| GET | /routine/:id | Get by ID |
| PATCH | /routine/:id | Update |
| DELETE | /routine/:id | Delete |

---

## 7. Payment

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /payment/fee-structure | Create fee structure |
| GET | /payment/fee-structure | List fee structures |
| POST | /payment | Record student payment |
| GET | /payment/history | Student payment history (?studentId=&month=&year=&status=) |

---

## 8. Attendance

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /attendance/record | Bearer + x-institution-id | Record single attendance |
| POST | /attendance/upload/csv | Bearer + x-institution-id | Preview CSV upload |
| POST | /attendance/upload/csv/submit | Bearer + x-institution-id | Submit CSV |
| POST | /attendance/upload/excel | Bearer + x-institution-id | Preview Excel |
| POST | /attendance/upload/image | Bearer + x-institution-id | OCR image upload |

---

## Roles
- SUPER_ADMIN
- INSTITUTION_ADMIN
- TEACHER
- STUDENT
- GUARDIAN
- ACCOUNTANT

---

## Headers
- `Authorization: Bearer <token>` - For protected endpoints
- `x-institution-id: <uuid>` - For attendance endpoints
