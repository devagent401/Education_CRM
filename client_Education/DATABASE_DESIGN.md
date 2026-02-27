# Database Design (Conceptual)

## Overview

This document describes the conceptual database schema for the Education Institution Portal. Designed for scalability, normalization, and future API integration.

---

## Entities

### 1. Institution

Multi-tenant root entity. Each institution has its own data scope.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| name | string | |
| slug | string | Unique, URL-friendly |
| code | string | Unique |
| email | string | |
| phone | string | Optional |
| address | text | Optional |
| logo_url | string | Optional |
| primary_color | string | Optional |
| secondary_color | string | Optional |
| status | enum | ACTIVE, SUSPENDED, TRIAL |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes:** slug, code, status

---

### 2. Courses

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| institution_id | UUID | FK → Institution |
| slug | string | Unique per institution |
| title | string | |
| description | text | |
| duration | string | e.g. "4 years" |
| eligibility | string | |
| outcomes | JSON/array | Learning outcomes |
| image_url | string | Optional |
| is_published | boolean | Default true |
| sort_order | int | For display order |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes:** institution_id, slug, is_published  
**Relations:** institution_id → Institution

---

### 3. Faculty

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| institution_id | UUID | FK → Institution |
| name | string | |
| role | string | e.g. "Head of Department" |
| qualification | string | |
| bio | text | Optional |
| image_url | string | Optional |
| email | string | Optional |
| social_links | JSON | Array of {type, url} |
| sort_order | int | |
| is_active | boolean | Default true |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes:** institution_id, is_active  
**Relations:** institution_id → Institution

---

### 4. Events

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| institution_id | UUID | FK → Institution |
| title | string | |
| description | text | Optional |
| date | date | |
| end_date | date | Optional |
| location | string | Optional |
| image_url | string | Optional |
| is_published | boolean | Default true |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes:** institution_id, date, is_published  
**Relations:** institution_id → Institution

---

### 5. Gallery

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| institution_id | UUID | FK → Institution |
| title | string | |
| type | enum | IMAGE, VIDEO |
| url | string | |
| thumbnail_url | string | Optional |
| event_id | UUID | Optional FK → Events |
| sort_order | int | |
| created_at | timestamp | |

**Indexes:** institution_id, event_id  
**Relations:** institution_id → Institution, event_id → Events

---

### 6. Notices

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| institution_id | UUID | FK → Institution |
| slug | string | Unique per institution |
| title | string | |
| content | text | |
| excerpt | string | Optional, for listing |
| published_at | timestamp | Null = draft |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes:** institution_id, slug, published_at  
**Relations:** institution_id → Institution

---

### 7. Testimonials

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| institution_id | UUID | FK → Institution |
| name | string | |
| role | string | e.g. "Alumni 2023" |
| content | text | |
| avatar_url | string | Optional |
| is_featured | boolean | Default false |
| sort_order | int | |
| created_at | timestamp | |

**Indexes:** institution_id, is_featured  
**Relations:** institution_id → Institution

---

### 8. Admin Users

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| institution_id | UUID | FK → Institution |
| email | string | Unique per institution |
| password_hash | string | |
| name | string | |
| role | enum | ADMIN, EDITOR, VIEWER |
| is_active | boolean | Default true |
| last_login_at | timestamp | Optional |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes:** institution_id, email  
**Relations:** institution_id → Institution

---

## Relationship Summary

```
Institution (1) ─────┬─ (N) Courses
                     ├─ (N) Faculty
                     ├─ (N) Events
                     ├─ (N) Gallery
                     ├─ (N) Notices
                     ├─ (N) Testimonials
                     └─ (N) Admin Users

Events (1) ────────── (N) Gallery (optional)
```

---

## Notes

- All timestamps in UTC
- Soft delete: add `deleted_at` where needed
- Multi-tenant: all queries scoped by `institution_id`
- Slug uniqueness is per institution, not global
