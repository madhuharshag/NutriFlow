import { NextResponse } from "next/server";
import { requireAuthAPI, handleApiError, checkRateLimit } from "@/lib/api-helpers";
import { saveMealSchema } from "@/lib/validations/api";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    const savedMeals = await prisma.mealEvent.findMany({
      where: {
        userId: auth.dbUser.id,
        eventType: "saved",
      },
      include: {
        recipe: {
          include: {
            nutritionEstimates: {
              include: { nutrient: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      savedMeals: savedMeals.map((event) => {
        const calories = event.recipe.nutritionEstimates.find(
          (n) => n.nutrient.name === "energy_kcal" || n.nutrient.name === "calories"
        );
        const protein = event.recipe.nutritionEstimates.find(
          (n) => n.nutrient.name === "protein_g" || n.nutrient.name === "protein"
        );

        return {
          id: event.id,
          recipeId: event.recipeId,
          name: event.recipe.name,
          slug: event.recipe.slug,
          description: event.recipe.description,
          mealTypes: event.recipe.mealTypes,
          cuisineRegion: event.recipe.cuisineRegion,
          totalTimeMinutes: event.recipe.totalTimeMinutes,
          costMin: event.recipe.costMin,
          costMax: event.recipe.costMax,
          difficultyLevel: event.recipe.difficultyLevel,
          calories: calories ? Math.round(calories.valueMin) : 350,
          protein: protein ? Math.round(protein.valueMin) : 10,
          savedAt: event.createdAt,
          notes: event.notes,
        };
      }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    if (!checkRateLimit(`saved:${auth.dbUser.id}`, 30)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const validated = saveMealSchema.parse(body);

    // Verify recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: validated.recipeId },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Check if already saved
    const existing = await prisma.mealEvent.findFirst({
      where: {
        userId: auth.dbUser.id,
        recipeId: validated.recipeId,
        eventType: validated.eventType,
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, id: existing.id, message: "Already saved" });
    }

    const event = await prisma.mealEvent.create({
      data: {
        userId: auth.dbUser.id,
        recipeId: validated.recipeId,
        eventType: validated.eventType,
        mealType: validated.mealType,
        rejectedReason: validated.rejectedReason,
        notes: validated.notes,
      },
    });

    return NextResponse.json({ success: true, id: event.id });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const recipeId = searchParams.get("recipeId");

    if (!id && !recipeId) {
      return NextResponse.json({ error: "id or recipeId is required" }, { status: 400 });
    }

    await prisma.mealEvent.deleteMany({
      where: {
        userId: auth.dbUser.id,
        eventType: "saved",
        ...(id ? { id } : {}),
        ...(recipeId ? { recipeId } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
