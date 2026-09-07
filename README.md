# NutriFlow

A next-generation nutrition and wellness web application designed to solve a practical everyday problem: 
*"Given my time, budget, dietary preferences, cooking ability, and available ingredients, what simple Indian meal should I eat or cook next?"*

## Project Status

NutriFlow MVP is **fully implemented and verified**:
- **Full-stack API Layer**: All core API routes implemented (`/api/onboarding`, `/api/recommendations`, `/api/recipes/[slug]`, `/api/pantry`, `/api/saved`, `/api/grocery`, `/api/profile`, `/api/feedback`, `/api/data-export`).
- **Deterministic Recommendation Engine**: Transparent rule-based scoring algorithm with unit test coverage.
- **Authentication & Authorization**: Supabase Auth integration with `/auth/callback` code exchange and automated user sync.
- **Client & Server Integration**: Dashboard, Onboarding, Plan, Pantry, Saved Meals, Grocery List, and Profile all connected to API routes with graceful client-side fallbacks.
- **Security**: Strict Zod validation on inputs, API rate limiting, CSP & production security headers in `next.config.ts`.
- **Database**: Validated Prisma 6.4.1 schema, client generation, and schema-compatible seed script.

## Architecture

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Database & ORM:** PostgreSQL via Prisma Client 6.4.1
- **Auth:** Supabase Auth & SSR helpers
- **Validation:** Zod 4

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed overview.

## Getting Started

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and configure your Supabase credentials.
4. Generate Prisma Client: `node --env-file=.env.local ./node_modules/.bin/prisma generate`.
5. Run tests: `npm test`.
6. Run build: `npm run build`.
7. Start dev server: `npm run dev`.

## Documentation

- [Security Policy](./SECURITY.md)
- [Privacy Handling](./PRIVACY.md)
- [Accessibility](./ACCESSIBILITY.md)
- [Nutrition Data Philosophy](./NUTRITION_DATA.md)
