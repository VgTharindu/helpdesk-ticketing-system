# Helpdesk Frontend (Next.js)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs at http://localhost:3000. Requires the Laravel backend running at the URL set in `.env.local`.

## Environment variables

| Variable | Description |
|---|---|
| `LARAVEL_API_URL` | Base URL of the Laravel API (server-side only, used by the Next.js proxy routes) |

## Architecture

- Next.js App Router, TypeScript, Tailwind CSS v4
- Auth: httpOnly cookie set by Next.js route handlers (`app/api/login`, `app/api/register`, `app/api/logout`); all other API calls go through a catch-all proxy (`app/api/proxy/[...path]`)
- Protected routes enforced in `middleware.ts`
- Server state: TanStack Query; client state (current user): Zustand
- Forms: React Hook Form + Zod

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

## Folder structure

- `app/` — routes (route groups: `(auth)` for login/register, `(app)` for authenticated pages)
- `features/` — feature-scoped API functions, hooks, and components (auth, dashboard, tickets, users)
- `components/ui` — reusable UI primitives
- `components/shared` — shared composite components (Pagination, EmptyState, ErrorState)
- `components/layout` — app shell (Sidebar, Topbar, MobileNav)
- `lib/api` — API client, types, error handling
- `stores/` — Zustand stores