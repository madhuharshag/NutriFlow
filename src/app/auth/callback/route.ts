import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      try {
        // Ensure user exists in Prisma database
        const existing = await prisma.user.findUnique({
          where: { supabaseId: data.user.id },
          include: { profile: true },
        });

        if (!existing) {
          await prisma.user.create({
            data: {
              supabaseId: data.user.id,
              email: data.user.email || "",
              profile: {
                create: {
                  displayName: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
                  onboardingDone: false,
                },
              },
            },
          });
          // Redirect first-time users to onboarding
          return NextResponse.redirect(`${origin}/onboarding`);
        } else if (!existing.profile?.onboardingDone) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      } catch (dbError) {
        console.error("Failed to sync user with database in auth callback:", dbError);
        // Still allow redirect to next
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
