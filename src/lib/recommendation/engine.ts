/**
 * NutriFlow Deterministic Recommendation Engine
 *
 * This is a fully transparent, rule-based scoring system.
 * No machine learning. No black boxes.
 * Every recommendation includes human-readable reasons.
 *
 * Score = ingredientMatch + dietCompatibility + allergenSafety +
 *         timeFit + budgetFit + skillFit + preferenceFit +
 *         nutritionHeuristic + variety
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface UserContext {
  dietaryPattern: string;
  allergens: string[];
  foodDislikes: string[];
  cuisineRegions: string[];
  cookingSkill: "BEGINNER" | "COMFORTABLE" | "CONFIDENT";
  budgetMax: number; // INR
  timeMinutes: number; // max minutes
  mealType: "BREAKFAST" | "LUNCH" | "SNACK" | "DINNER";
  pantryIngredients: string[]; // ingredient names
  goals: string[];
  recentRecipeIds?: string[]; // for variety scoring
}

export interface RecipeForScoring {
  id: string;
  slug: string;
  name: string;
  description: string;
  mealTypes: string[];
  cuisineRegion: string;
  dietaryPatterns: string[];
  difficultyLevel: "VERY_EASY" | "EASY" | "MODERATE" | "HARD";
  totalTimeMinutes: number;
  costMin: number;
  costMax: number;
  tags: string[];
  proteinSource?: string;
  ingredientNames: string[]; // flat list of ingredient names
  allergenTags: string[]; // aggregated allergen tags from all ingredients
  imageUrl?: string;
  nutritionNote?: string;
  whyItWorks?: string;
}

export interface ScoredRecipe {
  recipe: RecipeForScoring;
  rank: number;
  totalScore: number;
  subscores: {
    ingredientMatch: number;
    dietCompatibility: number;
    allergenSafety: number;
    timeFit: number;
    budgetFit: number;
    skillFit: number;
    preferenceFit: number;
    nutritionHeuristic: number;
    variety: number;
  };
  humanReasons: string[];
  missingIngredients: string[];
  suitabilityLabel: string;
  isPassing: boolean; // false if any hard safety gate fails
}

// ── Scoring weights (sum to 100 for interpretability) ────────────────────────

const WEIGHTS = {
  ingredientMatch: 25, // most important for pantry-based suggestions
  dietCompatibility: 20, // hard filter but also graded match
  allergenSafety: 20, // hard safety gate
  timeFit: 10,
  budgetFit: 10,
  skillFit: 5,
  preferenceFit: 5,
  nutritionHeuristic: 3,
  variety: 2,
};

function normalizeText(value: string | undefined | null): string {
  return (value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeList(values: Array<string | undefined | null> | undefined | null): string[] {
  return (values ?? []).map((value) => normalizeText(value)).filter(Boolean);
}

function getSafeRatio(numerator: number, denominator: number): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return 0;
  }
  return numerator / denominator;
}

// ── Diet compatibility mapping ────────────────────────────────────────────────

const DIET_HIERARCHY: Record<string, string[]> = {
  VEGAN: ["VEGAN"],
  JAIN_FRIENDLY: ["JAIN_FRIENDLY", "VEGAN", "VEGETARIAN"],
  VEGETARIAN: ["VEGETARIAN", "VEGAN"],
  EGGETARIAN: ["EGGETARIAN", "VEGETARIAN", "VEGAN"],
  NON_VEGETARIAN: ["NON_VEGETARIAN", "EGGETARIAN", "VEGETARIAN", "VEGAN"],
  OTHER: ["NON_VEGETARIAN", "EGGETARIAN", "VEGETARIAN", "VEGAN", "OTHER"],
};

// ── Skill mapping ─────────────────────────────────────────────────────────────

const SKILL_ALLOWS: Record<string, string[]> = {
  BEGINNER: ["VERY_EASY", "EASY"],
  COMFORTABLE: ["VERY_EASY", "EASY", "MODERATE"],
  CONFIDENT: ["VERY_EASY", "EASY", "MODERATE", "HARD"],
};

// ── Hard safety gates ─────────────────────────────────────────────────────────

function passesHardGates(recipe: RecipeForScoring, ctx: UserContext): boolean {
  const normalizedUserAllergens = normalizeList(ctx.allergens);
  const normalizedRecipeAllergens = normalizeList(recipe.allergenTags);

  // 1. Allergen safety — never suggest meals with declared allergens
  const userAllergenSet = new Set(normalizedUserAllergens);
  for (const allergenTag of normalizedRecipeAllergens) {
    if (userAllergenSet.has(allergenTag)) {
      return false;
    }
  }

  // 2. Time limit — never exceed hard time limit
  if (ctx.timeMinutes > 0 && recipe.totalTimeMinutes > ctx.timeMinutes * 1.2) {
    // 20% buffer for flexibility
    return false;
  }

  // 3. Budget limit — never exceed hard budget max (allow 20% buffer)
  if (ctx.budgetMax > 0 && recipe.costMin > ctx.budgetMax * 1.2) {
    return false;
  }

  // 4. Diet compatibility — hard filter
  const userDiet = normalizeText(ctx.dietaryPattern) || "vegetarian";
  const allowedPatterns = (DIET_HIERARCHY[userDiet.toUpperCase()] ?? []).map((d) =>
    normalizeText(d)
  );
  const recipePatterns = normalizeList(recipe.dietaryPatterns);
  const hasCompatibleDiet = recipePatterns.some((d) => allowedPatterns.includes(d));
  if (!hasCompatibleDiet) {
    return false;
  }

  // 5. Food dislikes — if a disliked ingredient is a primary ingredient, filter out
  const dislikesSet = new Set(normalizeList(ctx.foodDislikes));
  const primaryIngredients = recipe.ingredientNames.slice(0, 5).map((ing) => normalizeText(ing)); // first 5 are usually primary
  for (const ing of primaryIngredients) {
    if (dislikesSet.has(ing)) {
      return false;
    }
  }

  return true;
}

// ── Subscore functions ────────────────────────────────────────────────────────

function scoreIngredientMatch(
  recipe: RecipeForScoring,
  ctx: UserContext
): { score: number; matchedCount: number; totalCount: number } {
  const pantryIngredients = normalizeList(ctx.pantryIngredients);
  if (pantryIngredients.length === 0) return { score: 0.5, matchedCount: 0, totalCount: 0 };

  const pantrySet = new Set(pantryIngredients);
  const recipeIngredients = normalizeList(recipe.ingredientNames);
  const matchedCount = recipeIngredients.filter((i) => pantrySet.has(i)).length;
  const totalCount = recipeIngredients.length;

  if (totalCount === 0) return { score: 0.5, matchedCount: 0, totalCount: 0 };

  const ratio = matchedCount / totalCount;
  return { score: ratio, matchedCount, totalCount };
}

function scoreDietCompatibility(
  recipe: RecipeForScoring,
  ctx: UserContext
): number {
  const userDiet = normalizeText(ctx.dietaryPattern) || "vegetarian";
  const allowedPatterns = (DIET_HIERARCHY[userDiet.toUpperCase()] ?? []).map((d) =>
    normalizeText(d)
  );
  const normalizedRecipePatterns = normalizeList(recipe.dietaryPatterns);
  const hasExact = normalizedRecipePatterns.includes(userDiet);
  const hasCompatible = normalizedRecipePatterns.some((d) =>
    allowedPatterns.includes(d)
  );

  if (hasExact) return 1.0;
  if (hasCompatible) return 0.8;
  return 0; // Should already be filtered by hard gate
}

function scoreAllergenSafety(
  recipe: RecipeForScoring,
  ctx: UserContext
): number {
  // If it passed the hard gate, it's safe
  const userAllergenSet = new Set(normalizeList(ctx.allergens));
  const hasAllergen = normalizeList(recipe.allergenTags).some((tag) =>
    userAllergenSet.has(tag)
  );
  return hasAllergen ? 0 : 1.0;
}

function scoreTimeFit(recipe: RecipeForScoring, ctx: UserContext): number {
  const ratio = getSafeRatio(recipe.totalTimeMinutes, ctx.timeMinutes);
  if (ratio <= 0.5) return 1.0; // Very quick — perfect
  if (ratio <= 0.7) return 0.9;
  if (ratio <= 0.9) return 0.75;
  if (ratio <= 1.0) return 0.6;
  if (ratio <= 1.2) return 0.3; // Slightly over but within 20% buffer
  return 0; // Should be filtered by hard gate
}

function scoreBudgetFit(recipe: RecipeForScoring, ctx: UserContext): number {
  const avgCost = (recipe.costMin + recipe.costMax) / 2;
  const ratio = getSafeRatio(avgCost, ctx.budgetMax);
  if (ratio <= 0.5) return 1.0; // Very affordable
  if (ratio <= 0.7) return 0.9;
  if (ratio <= 0.9) return 0.75;
  if (ratio <= 1.0) return 0.6;
  if (ratio <= 1.2) return 0.3;
  return 0;
}

function scoreSkillFit(recipe: RecipeForScoring, ctx: UserContext): number {
  const allowedDifficulties = SKILL_ALLOWS[ctx.cookingSkill] ?? [];
  if (allowedDifficulties.includes(recipe.difficultyLevel)) return 1.0;
  // MODERATE for a beginner — possible but not ideal
  if (ctx.cookingSkill === "BEGINNER" && recipe.difficultyLevel === "MODERATE")
    return 0.4;
  return 0.2;
}

function scorePreferenceFit(
  recipe: RecipeForScoring,
  ctx: UserContext
): number {
  let score = 0;
  const normalizedUserCuisineRegions = normalizeList(ctx.cuisineRegions);
  const normalizedRecipeCuisine = normalizeText(recipe.cuisineRegion);
  const normalizedMealType = normalizeText(ctx.mealType);

  // Cuisine preference
  if (normalizedUserCuisineRegions.length === 0) {
    score += 0.5;
  } else if (
    normalizedUserCuisineRegions.includes(normalizedRecipeCuisine) ||
    normalizedUserCuisineRegions.includes("any")
  ) {
    score += 1.0;
  } else if (normalizedUserCuisineRegions.includes("mixed_indian")) {
    score += 0.7;
  } else {
    score += 0.3;
  }

  // Meal type match
  if (normalizeList(recipe.mealTypes).includes(normalizedMealType)) {
    score += 1.0;
  } else {
    score += 0;
  }

  return score / 2; // normalize to 0-1
}

function scoreNutritionHeuristic(
  recipe: RecipeForScoring,
  ctx: UserContext
): number {
  let score = 0.5; // base

  // Has a protein source — good for balance
  if (recipe.proteinSource) score += 0.2;

  const normalizedGoals = normalizeList(ctx.goals);
  // Goals-based heuristic
  if (normalizedGoals.includes("eat_balanced") && recipe.proteinSource) score += 0.15;
  if (normalizedGoals.includes("save_money") && ctx.budgetMax > 0 && recipe.costMin <= ctx.budgetMax * 0.6)
    score += 0.15;

  return Math.min(score, 1.0);
}

function scoreVariety(recipe: RecipeForScoring, ctx: UserContext): number {
  if (!ctx.recentRecipeIds || ctx.recentRecipeIds.length === 0) return 0.5;
  const recentRecipeIds = ctx.recentRecipeIds.map((id) => normalizeText(id));
  // Penalize recently recommended recipes
  if (recentRecipeIds.slice(0, 5).includes(normalizeText(recipe.id))) return 0;
  if (recentRecipeIds.slice(5, 10).includes(normalizeText(recipe.id))) return 0.4;
  return 1.0;
}

// ── Human-readable reason generator ──────────────────────────────────────────

function generateReasons(
  recipe: RecipeForScoring,
  ctx: UserContext,
  matchedCount: number,
  totalCount: number
): string[] {
  const reasons: string[] = [];
  const userDiet = normalizeText(ctx.dietaryPattern) || "vegetarian";
  const normalizedRecipeDietaryPatterns = normalizeList(recipe.dietaryPatterns);

  // Ingredient match
  if (matchedCount > 0) {
    reasons.push(
      `Uses ${matchedCount} of ${totalCount} recipe ingredients from your pantry`
    );
  }

  // Diet
  if (normalizedRecipeDietaryPatterns.includes(userDiet)) {
    const labels: Record<string, string> = {
      vegetarian: "vegetarian",
      vegan: "vegan",
      eggitarian: "eggetarian",
      jain_friendly: "Jain-friendly",
      non_vegetarian: "non-vegetarian",
      other: "other",
    };
    reasons.push(`Matches your ${labels[userDiet] ?? userDiet.replace(/_/g, " ")} preference`);
  }

  // Time
  if (ctx.timeMinutes > 0 && recipe.totalTimeMinutes <= ctx.timeMinutes) {
    reasons.push(`Ready in ${recipe.totalTimeMinutes} min — fits your schedule`);
  }

  // Budget
  const avgCost = (recipe.costMin + recipe.costMax) / 2;
  if (ctx.budgetMax > 0 && avgCost <= ctx.budgetMax) {
    reasons.push(`Within your ₹${ctx.budgetMax} budget (est. ₹${recipe.costMin}–₹${recipe.costMax})`);
  }

  // Skill
  if (SKILL_ALLOWS[ctx.cookingSkill]?.includes(recipe.difficultyLevel)) {
    reasons.push(`Beginner-friendly steps`);
  }

  // Protein
  if (recipe.proteinSource) {
    reasons.push(`Includes ${recipe.proteinSource} as a practical protein source`);
  }

  return reasons.slice(0, 4); // max 4 reasons
}

function getMissingIngredients(
  recipe: RecipeForScoring,
  ctx: UserContext
): string[] {
  const pantrySet = new Set(normalizeList(ctx.pantryIngredients));
  return normalizeList(recipe.ingredientNames)
    .filter((i) => !pantrySet.has(i))
    .slice(0, 5); // max 5 missing
}

function getSuitabilityLabel(totalScore: number, subscores: Record<string, number>): string {
  if (subscores.ingredientMatch >= 0.8 && totalScore >= 70) return "Great pantry match";
  if (subscores.timeFit >= 0.9 && subscores.budgetFit >= 0.8) return "Quick and affordable";
  if (subscores.ingredientMatch < 0.5) return "Needs a few extra ingredients";
  if (totalScore >= 80) return "Excellent match";
  if (totalScore >= 60) return "Good option for you";
  return "Worth trying";
}

// ── Main Scoring Function ─────────────────────────────────────────────────────

export function scoreRecipe(
  recipe: RecipeForScoring,
  ctx: UserContext
): ScoredRecipe {
  const passes = passesHardGates(recipe, ctx);

  if (!passes) {
    return {
      recipe,
      rank: 999,
      totalScore: 0,
      subscores: {
        ingredientMatch: 0,
        dietCompatibility: 0,
        allergenSafety: 0,
        timeFit: 0,
        budgetFit: 0,
        skillFit: 0,
        preferenceFit: 0,
        nutritionHeuristic: 0,
        variety: 0,
      },
      humanReasons: [],
      missingIngredients: [],
      suitabilityLabel: "Not suitable",
      isPassing: false,
    };
  }

  const { score: ingredientMatchRaw, matchedCount, totalCount } =
    scoreIngredientMatch(recipe, ctx);

  const subscores = {
    ingredientMatch: ingredientMatchRaw * WEIGHTS.ingredientMatch,
    dietCompatibility:
      scoreDietCompatibility(recipe, ctx) * WEIGHTS.dietCompatibility,
    allergenSafety: scoreAllergenSafety(recipe, ctx) * WEIGHTS.allergenSafety,
    timeFit: scoreTimeFit(recipe, ctx) * WEIGHTS.timeFit,
    budgetFit: scoreBudgetFit(recipe, ctx) * WEIGHTS.budgetFit,
    skillFit: scoreSkillFit(recipe, ctx) * WEIGHTS.skillFit,
    preferenceFit: scorePreferenceFit(recipe, ctx) * WEIGHTS.preferenceFit,
    nutritionHeuristic:
      scoreNutritionHeuristic(recipe, ctx) * WEIGHTS.nutritionHeuristic,
    variety: scoreVariety(recipe, ctx) * WEIGHTS.variety,
  };

  const totalScore = Object.values(subscores).reduce((a, b) => a + b, 0);

  const humanReasons = generateReasons(recipe, ctx, matchedCount, totalCount);
  const missingIngredients = getMissingIngredients(recipe, ctx);
  const suitabilityLabel = getSuitabilityLabel(totalScore, {
    ingredientMatch: ingredientMatchRaw,
    timeFit: scoreTimeFit(recipe, ctx),
    budgetFit: scoreBudgetFit(recipe, ctx),
  });

  return {
    recipe,
    rank: 0, // assigned after sorting
    totalScore,
    subscores,
    humanReasons,
    missingIngredients,
    suitabilityLabel,
    isPassing: true,
  };
}

// ── Top-N Recommendations ─────────────────────────────────────────────────────

export function getTopRecommendations(
  recipes: RecipeForScoring[],
  ctx: UserContext,
  count = 3
): ScoredRecipe[] {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.trunc(Number(count))) : 3;

  const scored = recipes
    .map((recipe) => scoreRecipe(recipe, ctx))
    .filter((r) => r.isPassing)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, safeCount)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return scored;
}
