import { NextResponse } from "next/server";
import { getUser, getOrCreateDbUser } from "./auth-helpers";
import { ZodError } from "zod";
export { checkRateLimit } from "./rate-limit";

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
