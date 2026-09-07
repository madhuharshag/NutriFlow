import { NextResponse } from "next/server";
import { requireAuthAPI, handleApiError, checkRateLimit } from "@/lib/api-helpers";
import { onboardingSchema } from "@/lib/validations/onboarding";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    if (!checkRateLimit(`onboarding:${auth.dbUser.id}`, 10)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const validated = onboardingSchema.parse(body);

    const {
      dietaryPattern,
      allergens,
      foodDislikes,
      cuisineRegions,
      cookingSkill,
      budgetMin,
      budgetMax,
      timeMinutes,
      goals,
      pantryIngredients,
    } = validated;

    // Use transaction to update profile, preferences, allergens, and initial pantry
    await prisma.$transaction(async (tx) => {
      // 1. Mark onboarding as done
      await tx.userProfile.upsert({
        where: { userId: auth.dbUser.id },
        update: { onboardingDone: true },
        create: {
          userId: auth.dbUser.id,
          displayName: auth.supabaseUser.user_metadata?.full_name || auth.supabaseUser.email?.split("@")[0] || "User",
          onboardingDone: true,
        },
      });

      // 2. Upsert preferences
      await tx.userPreference.upsert({
        where: { userId: auth.dbUser.id },
        update: {
          dietaryPattern,
          cookingSkill,
          budgetMin,
          budgetMax,
          timeMinutes,
          cuisineRegions,
          goals,
          foodDislikes,
        },
        create: {
          userId: auth.dbUser.id,
          dietaryPattern,
          cookingSkill,
          budgetMin,
          budgetMax,
          timeMinutes,
          cuisineRegions,
          goals,
          foodDislikes,
        },
      });

      // 3. Update allergens (delete existing and insert new)
      await tx.userAllergen.deleteMany({
        where: { userId: auth.dbUser.id },
      });

      if (allergens.length > 0) {
        await tx.userAllergen.createMany({
          data: allergens.map((allergen) => ({
            userId: auth.dbUser.id,
            allergen: allergen.toLowerCase().trim(),
          })),
        });
      }

      // 4. Populate initial pantry items if provided
      if (pantryIngredients.length > 0) {
        for (const ingName of pantryIngredients) {
          const trimmed = ingName.trim();
          if (!trimmed) continue;

          // Find or create ingredient
          let ingredient = await tx.ingredient.findFirst({
            where: { name: { equals: trimmed, mode: "insensitive" } },
          });

          if (!ingredient) {
            ingredient = await tx.ingredient.create({
              data: {
                name: trimmed,
                category: "PANTRY" as any,
              },
            });
          }

          await tx.pantryItem.upsert({
            where: {
              userId_ingredientId: {
                userId: auth.dbUser.id,
                ingredientId: ingredient.id,
              },
            },
            update: {},
            create: {
              userId: auth.dbUser.id,
              ingredientId: ingredient.id,
            },
          });
        }
      }
    });

    return NextResponse.json({ success: true, message: "Onboarding completed successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
