import { NextResponse } from "next/server";
import { requireAuthAPI, handleApiError, checkRateLimit } from "@/lib/api-helpers";
import { updateProfileSchema } from "@/lib/validations/api";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    const user = await prisma.user.findUnique({
      where: { id: auth.dbUser.id },
      include: {
        profile: true,
        preference: true,
        allergens: true,
        _count: {
          select: {
            pantryItems: true,
            mealEvents: true,
            groceryLists: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName || "User",
        preferredLanguage: user.profile?.preferredLanguage || "en",
        onboardingDone: user.profile?.onboardingDone || false,
        preference: user.preference,
        allergens: user.allergens.map((a) => a.allergen),
        counts: user._count,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    if (!checkRateLimit(`profile:${auth.dbUser.id}`, 20)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const validated = updateProfileSchema.parse(body);

    await prisma.$transaction(async (tx) => {
      if (validated.displayName || validated.preferredLanguage) {
        await tx.userProfile.upsert({
          where: { userId: auth.dbUser.id },
          update: {
            ...(validated.displayName && { displayName: validated.displayName }),
            ...(validated.preferredLanguage && { preferredLanguage: validated.preferredLanguage }),
          },
          create: {
            userId: auth.dbUser.id,
            displayName: validated.displayName || "User",
            preferredLanguage: validated.preferredLanguage || "en",
          },
        });
      }

      const prefUpdates: any = {};
      if (validated.dietaryPattern) prefUpdates.dietaryPattern = validated.dietaryPattern;
      if (validated.cookingSkill) prefUpdates.cookingSkill = validated.cookingSkill;
      if (validated.budgetMin !== undefined) prefUpdates.budgetMin = validated.budgetMin;
      if (validated.budgetMax !== undefined) prefUpdates.budgetMax = validated.budgetMax;
      if (validated.timeMinutes !== undefined) prefUpdates.timeMinutes = validated.timeMinutes;

      if (Object.keys(prefUpdates).length > 0) {
        await tx.userPreference.upsert({
          where: { userId: auth.dbUser.id },
          update: prefUpdates,
          create: {
            userId: auth.dbUser.id,
            ...prefUpdates,
          },
        });
      }
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    // Log deletion request for compliance
    await prisma.deletionRequest.create({
      data: {
        userId: auth.dbUser.id,
        status: "PENDING",
        reason: "User requested account deletion via settings",
        scheduledAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 day grace period
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account deletion requested. Your data will be deleted in 30 days as per privacy policy.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
