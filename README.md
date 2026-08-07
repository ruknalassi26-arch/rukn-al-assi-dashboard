# Rukn Al Assi — Industrial & Engineering Dashboard & Portal

An enterprise-grade administrative dashboard and public website portal for **Rukn Al Assi**, built with Next.js 15 (App Router), TypeScript, Clean Architecture, Supabase Auth & Storage, React Query, shadcn/ui, and trilingual support (English, Arabic, Kurdish Sorani).

---

## 🌟 Key Features & Modules

### 1. Careers & Job Applications
- **Job Postings Management**: Create, edit, publish, archive, and delete career opportunities with trilingual titles, requirements, and responsibilities.
- **Applicant Submissions**: Public career portal (`/careers` and `/careers/[slug]`) allowing candidate resumes (PDF, DOC, DOCX) to be uploaded to Supabase Storage (`career-cvs`).
- **Application Review**: Admin review table with candidate status workflow (New, Reviewed, Shortlisted, Rejected, Hired), notes, and direct CV download.

### 2. User & Security Role Management
- **Secure Auth Admin Integration**: Server-side user creation via `/api/admin/users` utilizing Supabase Auth Admin API and non-exposing service role operations.
- **Granular Security Roles**: Role management (`/admin/roles`) with dynamic module permission matrices (Products, Services, Projects, Homepage, RFQ, Contact, Users, Roles, Settings, Activity Log).
- **Admin User Control**: Manage user profiles (`/admin/users`), assign roles, toggle active/inactive account status, and view last login timestamps.

### 3. Trilingual Localization (`next-intl`)
- Complete first-class support for **English (`en`)**, **Arabic (`ar`)**, and **Kurdish Sorani (`ckb`)**.
- Dynamic RTL (Right-to-Left) and LTR layout switching with localized tabs and form fields across all admin managers.

### 4. Global Search & Command Palette
- Instant `Ctrl+K` / `Cmd+K` Command Palette accessible across all OS keyboard input layouts (English, Arabic, Kurdish).
- Search products, services, projects, RFQs, job postings, team members, and settings.

### 5. Audit Activity Logging
- Automated background logging into `activity_log` for all administrative actions across users, roles, careers, products, services, settings, and SEO configuration.

---

## 🏗️ Architecture & Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth, Storage Buckets)
- **State & Data Fetching**: TanStack React Query v5
- **Forms & Validation**: React Hook Form + Zod
- **UI Components**: Tailwind CSS + shadcn/ui
- **Localization**: next-intl

### Clean Architecture Pattern
```
src/
├── app/                  # Next.js App Router (Pages & Server API routes)
├── core/                 # Shared types, Supabase clients & infrastructure
├── features/             # Feature-first modules
│   ├── careers/          # Domain, Data DTOs, Repositories, Use Cases, UI
│   ├── roles-permissions/# Domain, Data DTOs, Repositories, Use Cases, UI
│   ├── products/         # Product catalog management
│   ├── services/         # Engineering services
│   └── ...
└── shared/               # Reusable UI components, dialogs, hooks, layouts
```

---

## 🚀 Getting Started

### Package Manager Requirement
> **ALWAYS use Bun (`bun`) for development, building, and package management.**

### Development Server
```bash
bun dev
```

### Type Checking & Linting
```bash
bun run type-check
bun run lint
```

### Production Build
```bash
bun run build
```

---

## 🔒 Environment Variables

Copy `.env.example` to `.env.local` and populate your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
