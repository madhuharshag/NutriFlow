import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as DbUser } from "@prisma/client";

/**
 * Gets the current authenticated Supabase user.
 */
export async function getUser(): Promise<SupabaseUser | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  return user;
}

/**
 * Ensures a user exists in Prisma mapped to the Supabase ID.
 * Creates one if not present.
 */
export async function getOrCreateDbUser(supabaseUser: SupabaseUser) {
  let dbUser = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
    include: {
      profile: true,
      preference: true,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        supabaseId: supabaseUser.id,
        email: supabaseUser.email || "",
        profile: {
          create: {
            displayName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "User",
            onboardingDone: false,
          },
        },
      },
      include: {
        profile: true,
        preference: true,
      },
    });
  }

  return dbUser;
}

/**
 * Gets the user from Supabase and requires them to exist in the Prisma database.
 * If not authenticated, redirects to login.
 */
export async function requireAuth(redirectTo = "/login") {
  const user = await getUser();
  
  if (!user) {
    redirect(redirectTo);
  }

  const dbUser = await getOrCreateDbUser(user);

  return { supabaseUser: user, dbUser };
}
