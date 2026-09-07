import { NextResponse } from "next/server";
import { getUser, getOrCreateDbUser } from "./auth-helpers";
import { ZodError } from "zod";

// Simple in-memory rate limiter per IP/user
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(key: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

export async function requireAuthAPI() {
  const supabaseUser = await getUser();
  if (!supabaseUser) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const dbUser = await getOrCreateDbUser(supabaseUser);
  return { supabaseUser, dbUser };
}

export function handleApiError(error: unknown) {
  console.error("API Route Error:", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
}
