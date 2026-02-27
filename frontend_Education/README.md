# Edu Institution Manager

Production-grade Educational Institution Management Frontend built with Next.js (App Router), TypeScript, Tailwind CSS, and ShadCN UI.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **ShadCN UI** (new-york style)
- **clsx / tailwind-merge / cva** – class utilities
- **TanStack Query** – server state
- **Zustand** – client state
- **React Hook Form + Zod** – forms & validation
- **Lucide Icons**
- **next-themes** – dark/light mode

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/dashboard` by default.

## Folder Structure

```
app/
├── (auth)/           # Auth route group
│   ├── login/
│   └── register/
├── (dashboard)/      # Dashboard route group
│   ├── layout.tsx   # Sidebar + navbar
│   └── dashboard/
│       ├── page.tsx
│       ├── students/
│       ├── teachers/
│       ├── attendance/
│       ├── exams/
│       ├── fees/
│       └── settings/
components/
├── ui/               # ShadCN base components
├── shared/           # Reusable business components (e.g. ThemeToggle)
├── layout/           # AppSidebar, DashboardNavbar
├── providers/        # ThemeProvider, QueryProvider
├── forms/            # Form components
├── tables/           # Data table components
├── cards/
├── modals/
├── charts/
├── empty-states/
├── loaders/
lib/
├── api/              # API client
├── hooks/
├── stores/           # Zustand stores (e.g. useInstitutionStore)
├── utils/            # cn(), etc.
├── constants/        # ROUTES, APP_NAME, nav items
styles/
└── globals.css       # Design tokens (spacing scale)
```

## Theme (Dark/Light Mode)

- **ThemeProvider** wraps the app and uses `next-themes` with `attribute="class"`.
- System preference is respected by default.
- Theme is persisted in `localStorage` under `edu-institution-theme`.
- **ThemeToggle** is available in the sidebar footer.
- Use `dark:` Tailwind variants for dark mode styles.

## Best Practices

1. **Atomic components** – Keep components under ~200 lines; split by responsibility.
2. **No magic styles** – Use design tokens from `styles/globals.css` (e.g. `var(--spacing-page)`).
3. **ReliCSS mindset** – Prefer utility classes; avoid deep selectors.
4. **No prop drilling** – Use Zustand or hooks for shared state.
5. **Typed props** – Use TypeScript for all component props.
6. **Mobile-first** – Use Tailwind responsive prefixes (`md:`, `lg:`).
7. **Accessibility** – Use semantic HTML, ARIA where needed, keyboard navigation.
