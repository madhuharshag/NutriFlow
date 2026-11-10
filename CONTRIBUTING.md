# Contributing to NutriFlow

Thank you for your interest in contributing to NutriFlow! This document outlines our development process, coding standards, and how to submit contributions.

---

## Code of Conduct & Philosophy

NutriFlow is built to provide practical, accessible, and transparent nutrition and meal planning for everyday wellness.
- **Transparency First**: Recommendations must use deterministic, explainable scoring with human-readable rationale.
- **Safety First**: Allergen filtering is strict and non-negotiable.
- **Privacy First**: Sensitive dietary and health data is never sold or used for ad targeting.

---

## Development Setup

### Prerequisites
- **Node.js**: v20.x or higher (Node 22+ recommended)
- **npm**: v10.x or higher
- **PostgreSQL**: Local Postgres instance or a Supabase project

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/madhuharsha/NutriFlow.git
   cd NutriFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and database connection string.

4. **Generate Prisma Client & Seed Data**:
   ```bash
   npx prisma generate
   npx prisma db seed # optional: seeds sample Indian recipes and core ingredients
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts Next.js Turbopack development server |
| **Lint** | `npm run lint` | Runs ESLint 9 across all project files |
| **Typecheck** | `npm run typecheck` | Runs TypeScript compiler checks without emitting files |
| **Test** | `npm run test` | Executes native Node.js unit tests across `src/**/*.test.ts` |
| **Build** | `npm run build` | Compiles optimized production Next.js build |
| **Vercel Build** | `npm run vercel-build` | Generates Prisma client followed by Next.js build |

---

## Code Standards & Conventions

### 1. TypeScript & Types
- Avoid `any`. Use explicit interfaces or types from `@prisma/client` and domain models.
- All API route request bodies must be parsed and validated through Zod schemas located in `src/lib/validations/`.

### 2. Styling
- Use Tailwind CSS v4 utility classes.
- Follow existing color tokens (`brand-green`, `brand-turmeric`, `brand-cream`, `surface-muted`).
- Ensure all interactive elements include visible focus rings and accessible ARIA attributes.

### 3. Tests
- Tests are written with Node's native test runner (`node:test` and `node:assert`).
- Add tests for new business logic, recommendation scoring rules, and schema validations.
- Run `npm run test` and ensure all tests pass before opening a Pull Request.

---

## Commit Guidelines

We follow the Conventional Commits specification:
- `feat(...)`: New user-facing feature or API capability
- `fix(...)`: Bug fix or type correction
- `test(...)`: Adding or updating test cases
- `docs(...)`: Documentation changes
- `refactor(...)`: Code changes that neither fix a bug nor add a feature
- `ci(...)`: GitHub Actions or build pipeline adjustments

---

## Submitting Changes

1. Create a feature branch: `git checkout -b feat/your-feature-name`.
2. Make your changes adhering to code standards.
3. Verify all checks pass:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```
4. Commit your changes with descriptive messages.
5. Push your branch and submit a Pull Request to `main`.
