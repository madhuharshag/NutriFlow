# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within NutriFlow, please send an e-mail to support@nutriflow.example.com. All security vulnerabilities will be promptly addressed.

## Core Security Principles

### 1. Authentication & Session Management
- All authentication is handled by Supabase Auth.
- We use HTTP-only, secure cookies for session management in the Next.js App Router.
- Route protection is enforced at the Edge via `middleware.ts`.

### 2. Database Access (Row Level Security)
- When fully deployed, the Supabase PostgreSQL database uses Row Level Security (RLS) policies.
- A user can only read, update, or delete data that belongs to their `user_id`.

### 3. Environment Variables
- Secrets (like `SUPABASE_SERVICE_ROLE_KEY` or `DATABASE_URL`) are never committed to version control.
- Client-side variables are strictly prefixed with `NEXT_PUBLIC_`.

### 4. Data Sanitization
- All inputs are validated and sanitized (using libraries like Zod when applicable).
- Next.js automatically escapes React rendering to prevent XSS.

### 5. API Protection
- API routes verify the session token before performing any action.
- Rate limiting is planned for implementation on all critical endpoints.
