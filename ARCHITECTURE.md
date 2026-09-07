# Architecture Overview

NutriFlow is a modern Next.js application designed to provide reliable, deterministic meal recommendations without relying on unpredictable AI logic for core features.

## Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS V4, Custom Design Tokens
- **UI Components:** Lucide Icons, Shadcn-style patterns
- **Database:** PostgreSQL (Supabase / Neon)
- **ORM:** Prisma Client
- **Authentication:** Supabase Auth (SSR + Middleware)

## Core Modules

### 1. Recommendation Engine (`/src/lib/recommendation/engine.ts`)
The recommendation engine is entirely deterministic. It uses a 9-dimensional scoring system to rank meals based on the user's current context.
- **Hard Gates:** Instantly filters out recipes that conflict with allergies, hard budget limits, hard time limits, or dietary restrictions.
- **Scoring Weights:** 
  - Ingredient Match (Pantry): 25%
  - Diet Compatibility: 20%
  - Allergen Safety: 20%
  - Time Fit: 10%
  - Budget Fit: 10%
  - Skill Fit: 5%
  - Preference Fit: 5%
  - Nutrition Heuristic: 3%
  - Variety: 2%

### 2. Authentication (`/src/lib/supabase`)
Authentication is handled via Supabase using cookie-based sessions to support Server Components.
- `middleware.ts` protects the `(dashboard)` routes and the `/onboarding` route.
- Unauthenticated users are redirected to `/login`.

### 3. Database Schema (`/prisma/schema.prisma`)
The database uses 23 distinct models to represent users, recipes, ingredients, and their complex relationships.
- **Core Entities:** `User`, `Recipe`, `Ingredient`, `UserPreference`
- **Join Tables:** `RecipeIngredient`, `UserPantryItem`, `SavedRecipe`

## File Structure
- `/src/app/(auth)`: Login, Signup, Reset Password, Verify Email
- `/src/app/(dashboard)`: Protected routes (Home, Plan, Pantry, Saved, Grocery, Profile)
- `/src/app/(public)`: Legal and static pages (Privacy, Terms, Disclaimer)
- `/src/components`: Reusable UI components
- `/src/lib`: Core logic and utilities
