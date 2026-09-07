import { NextResponse } from "next/server";
import { requireAuthAPI, handleApiError, checkRateLimit } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    if (!checkRateLimit(`data-export:${auth.dbUser.id}`, 3, 3600_000)) {
      return NextResponse.json(
        { error: "Export rate limit exceeded. You can request at most 3 exports per hour." },
        { status: 429 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: auth.dbUser.id },
      include: {
        profile: true,
        preference: true,
        allergens: true,
        pantryItems: { include: { ingredient: true } },
        mealEvents: { include: { recipe: true } },
        groceryLists: { include: { items: true } },
      },
    });

    await prisma.dataExportRequest.create({
      data: {
        userId: auth.dbUser.id,
        status: "COMPLETED",
        processedAt: new Date(),
      },
    });

    // Strip sensitive internal fields
    return NextResponse.json({
      exportDate: new Date().toISOString(),
      user: {
        email: userData?.email,
        profile: userData?.profile,
        preference: userData?.preference,
        allergens: userData?.allergens.map((a) => a.allergen),
        pantryItems: userData?.pantryItems.map((p) => ({
          ingredient: p.ingredient.name,
          category: p.ingredient.category,
          isLow: p.isLow,
          notes: p.notes,
        })),
        mealHistory: userData?.mealEvents.map((e) => ({
          recipeName: e.recipe.name,
          eventType: e.eventType,
          date: e.createdAt,
          notes: e.notes,
        })),
        groceryLists: userData?.groceryLists.map((g) => ({
          name: g.name,
          items: g.items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            isChecked: i.isChecked,
          })),
        })),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
