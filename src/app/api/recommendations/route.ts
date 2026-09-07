import { NextResponse } from "next/server";
import { requireAuthAPI, handleApiError, checkRateLimit } from "@/lib/api-helpers";
import { recommendationRequestSchema } from "@/lib/validations/recommendations";
import { getTopRecommendations } from "@/lib/recommendation/engine";
import type { RecipeForScoring, UserContext } from "@/lib/recommendation/engine";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const auth = await requireAuthAPI();
    if ("error" in auth) return auth.error;

    if (!checkRateLimit(`rec:${auth.dbUser.id}`, 30)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const validated = recommendationRequestSchema.parse(body);

    // Fetch user preferences, allergens, and pantry items from DB
    const userPrefs = await prisma.userPreference.findUnique({
      where: { userId: auth.dbUser.id },
    });

    const userAllergens = await prisma.userAllergen.findMany({
      where: { userId: auth.dbUser.id },
      select: { allergen: true },
    });

    const userPantry = await prisma.pantryItem.findMany({
      where: { userId: auth.dbUser.id },
      include: { ingredient: true },
    });

    // Fetch recent recipes cooked/rejected for variety scoring
    const recentEvents = await prisma.mealEvent.findMany({
      where: { userId: auth.dbUser.id },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { recipeId: true },
    });

    // Build context
    const ctx: UserContext = {
      dietaryPattern: validated.dietaryPattern || userPrefs?.dietaryPattern || "VEGETARIAN",
      allergens: userAllergens.map((a) => a.allergen.toLowerCase()),
      foodDislikes: [...(userPrefs?.foodDislikes || []), ...validated.excludedIngredients],
      cuisineRegions: validated.cuisineRegions || userPrefs?.cuisineRegions || ["PAN_INDIAN"],
      cookingSkill: (validated.cookingSkill || userPrefs?.cookingSkill || "BEGINNER") as any,
      budgetMax: validated.budgetLimitINR || userPrefs?.budgetMax || 150,
      timeMinutes: validated.timeLimitMinutes || userPrefs?.timeMinutes || 30,
      mealType: validated.mealType,
      pantryIngredients: [
        ...userPantry.map((p) => p.ingredient.name),
        ...validated.requiredIngredients,
      ],
      goals: userPrefs?.goals || [],
      recentRecipeIds: recentEvents.map((e) => e.recipeId),
    };

    // Query published recipes from database with ingredients and allergens
    const dbRecipes = await prisma.recipe.findMany({
      where: {
        isPublished: true,
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    let recipesForScoring: RecipeForScoring[] = [];

    if (dbRecipes.length > 0) {
      recipesForScoring = dbRecipes.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        mealTypes: r.mealTypes,
        cuisineRegion: r.cuisineRegion,
        dietaryPatterns: r.dietaryPatterns,
        difficultyLevel: r.difficultyLevel as any,
        totalTimeMinutes: r.totalTimeMinutes,
        costMin: r.costMin,
        costMax: r.costMax,
        tags: r.tags,
        proteinSource: r.proteinSource || undefined,
        imageUrl: r.imageUrl || undefined,
        nutritionNote: r.nutritionNote || undefined,
        whyItWorks: r.whyItWorks || undefined,
        ingredientNames: r.ingredients.map((i) => i.ingredient.name),
        allergenTags: Array.from(
          new Set(r.ingredients.flatMap((i) => i.ingredient.allergenTags || []))
        ),
      }));
    }

    // Run deterministic recommendation engine
    const recommendations = getTopRecommendations(
      recipesForScoring,
      ctx,
      validated.limit
    );

    // Save recommendations snapshot to DB for compliance and audit
    if (recommendations.length > 0) {
      try {
        await prisma.$transaction(
          recommendations.map((rec) =>
            prisma.recommendation.create({
              data: {
                userId: auth.dbUser.id,
                recipeId: rec.recipe.id,
                rank: rec.rank,
                totalScore: rec.totalScore,
                ingredientMatch: rec.subscores.ingredientMatch,
                dietCompatibility: rec.subscores.dietCompatibility,
                allergenSafety: rec.subscores.allergenSafety,
                timeFit: rec.subscores.timeFit,
                budgetFit: rec.subscores.budgetFit,
                skillFit: rec.subscores.skillFit,
                preferenceFit: rec.subscores.preferenceFit,
                nutritionHeuristic: rec.subscores.nutritionHeuristic,
                varietyScore: rec.subscores.variety,
                humanReasons: rec.humanReasons,
                missingIngredients: rec.missingIngredients,
                suitabilityLabel: rec.suitabilityLabel,
                contextSnapshot: ctx as any,
              },
            })
          )
        );
      } catch (dbErr) {
        console.error("Failed to save recommendations log:", dbErr);
      }
    }

    return NextResponse.json({
      recommendations,
      context: {
        mealType: ctx.mealType,
        dietaryPattern: ctx.dietaryPattern,
        timeMinutes: ctx.timeMinutes,
        budgetMax: ctx.budgetMax,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
