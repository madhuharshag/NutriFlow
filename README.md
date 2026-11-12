# NutriFlow

[![CI](https://github.com/madhuharsha/NutriFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/madhuharsha/NutriFlow/actions/workflows/ci.yml)

A next-generation nutrition and wellness web application designed to solve a practical everyday problem: 
*"Given my time, budget, dietary preferences, cooking ability, and available ingredients, what simple Indian meal should I eat or cook next?"*

## Project Status

NutriFlow MVP is **fully implemented and verified**:
- **Full-stack API Layer**: All core API routes implemented (`/api/onboarding`, `/api/recommendations`, `/api/recipes/[slug]`, `/api/pantry`, `/api/saved`, `/api/grocery`, `/api/profile`, `/api/feedback`, `/api/data-export`, `/api/health`).
- **Deterministic Recommendation Engine**: Transparent rule-based scoring algorithm with unit test coverage.
- **Authentication & Authorization**: Supabase Auth integration with `/auth/callback` code exchange and automated user sync.
- **Client & Server Integration**: Dashboard, Onboarding, Plan, Pantry, Saved Meals, Grocery List, and Profile all connected to API routes with graceful client-side fallbacks.
- **Security**: Strict Zod validation on inputs, API rate limiting, CSP & production security headers in `next.config.ts`.
- **Database**: Validated Prisma 6.4.1 schema, client generation, and schema-compatible seed script.
- **Automated CI**: GitHub Actions workflow running lint, typecheck, unit tests, and production build on every push and PR.

## Architecture

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Database & ORM:** PostgreSQL via Prisma Client 6.4.1
- **Auth:** Supabase Auth & SSR helpers
- **Validation:** Zod 4
- **Testing:** Node.js native test runner (`node:test`, `node:assert`)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed overview.

## Getting Started

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and configure your Supabase credentials.
4. Generate Prisma Client: `npx prisma generate`.
5. Run tests: `npm test`.
6. Run typecheck & lint: `npm run typecheck && npm run lint`.
7. Run build: `npm run build`.
8. Start dev server: `npm run dev`.

## Monitoring & Health Probes

NutriFlow provides automated monitoring and container probe endpoints:
- **Liveness & Health (`/api/health`)**: Returns HTTP `200` with uptime, environment, and latency metrics; returns `503` if database connectivity drops.
- **Readiness (`/api/ready`)**: Lightweight container readiness probe verifying pool connectivity for Kubernetes/Docker deployments.

## Core Utilities

- **Nutrition Calculators (`src/lib/nutrition.ts`)**: Deterministic Mifflin-St Jeor BMR estimation, activity-based TDEE, and balanced macronutrient breakdowns.
- **Hydration Recommendations (`src/lib/water-intake.ts`)**: Daily water intake estimator incorporating climate temperature, humidity, and exercise intensity.
- **Recipe Serving Scaler (`src/lib/recipe-scaler.ts`)**: Proportional ingredient amount and cost scaling with sensible culinary fraction formatting.
- **Daily Meal Plan Aggregator (`src/lib/plan-aggregator.ts`)**: Consolidates multi-meal calories, macros, preparation time, and budget compliance against user targets.
- **Dietary & Allergen Safety (`src/lib/allergen-checker.ts`)**: Standalone conflict detector flagging dietary pattern violations and allergens across ingredient sets.
- **Grocery Consolidation (`src/lib/grocery.ts`)**: Intelligent item grouping, alias normalization, and unit conversion.
- **Grocery Export Formats (`src/lib/grocery-export.ts`)**: Plaintext, Markdown, and URL-encoded messaging formatters (WhatsApp, SMS) for grocery lists.
- **Pantry Freshness (`src/lib/pantry-shelf-life.ts`)**: Category-specific shelf-life estimation and expiration warning detection.
- **Pantry Token Search (`src/lib/pantry-search.ts`)**: Multi-token fuzzy-normalized matching and category-based filtering for pantry inventories.
- **Recipe Filtering & Sorting (`src/lib/recipe-filters.ts`)**: Filter and sort recipes by max cooking time, difficulty level, and estimated cost.
- **Cooking Effort & One-Pot Scorer (`src/lib/cooking-effort.ts`)**: Cooking effort index combining prep/cook time, step counts, and one-pot meal detection.
- **Server-Timing Telemetry (`src/lib/perf-timing.ts`)**: Non-throwing high-resolution execution timer and W3C `Server-Timing` header generator for API route telemetry.

## Documentation & Contributing

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)
- [Privacy Handling](./PRIVACY.md)
- [Accessibility](./ACCESSIBILITY.md)
- [Nutrition Data Philosophy](./NUTRITION_DATA.md)
