import { describe, it } from "node:test";
import assert from "node:assert";
import {
  scoreRecipe,
  getTopRecommendations,
  type RecipeForScoring,
  type UserContext,
} from "./engine.ts";

const sampleRecipes: RecipeForScoring[] = [
  {
    id: "r1",
    slug: "moong-dal-khichdi",
    name: "Moong Dal Khichdi",
    description: "One-pot comfort meal with rice and yellow moong dal.",
    mealTypes: ["LUNCH", "DINNER"],
    cuisineRegion: "NORTH_INDIAN",
    dietaryPatterns: ["VEGETARIAN", "VEGAN"],
    difficultyLevel: "EASY",
    totalTimeMinutes: 25,
    costMin: 40,
    costMax: 60,
    tags: ["One-Pot", "High Protein", "Comfort Food"],
    proteinSource: "Moong dal",
    ingredientNames: ["Rice", "Moong Dal", "Onion", "Tomato", "Spices", "Cooking oil"],
    allergenTags: [],
  },
  {
    id: "r2",
    slug: "poha-peanuts",
    name: "Poha with Peanuts",
    description: "Fluffy flattened rice tossed with mustard seeds and peanuts.",
    mealTypes: ["BREAKFAST", "SNACK"],
    cuisineRegion: "MIXED_INDIAN",
    dietaryPatterns: ["VEGETARIAN", "VEGAN"],
    difficultyLevel: "VERY_EASY",
    totalTimeMinutes: 15,
    costMin: 30,
    costMax: 45,
    tags: ["Quick", "Breakfast"],
    proteinSource: "Peanuts",
    ingredientNames: ["Poha", "Peanuts", "Onion", "Spices", "Cooking oil"],
    allergenTags: ["peanuts"],
  },
  {
    id: "r3",
    slug: "chicken-curry",
    name: "Chicken Curry",
    description: "Traditional homestyle chicken curry.",
    mealTypes: ["LUNCH", "DINNER"],
    cuisineRegion: "NORTH_INDIAN",
    dietaryPatterns: ["NON_VEGETARIAN"],
    difficultyLevel: "MODERATE",
    totalTimeMinutes: 45,
    costMin: 120,
    costMax: 180,
    tags: ["High Protein"],
    proteinSource: "Chicken",
    ingredientNames: ["Chicken", "Onion", "Tomato", "Ginger", "Garlic", "Spices"],
    allergenTags: [],
  },
];

const vegetarianUser: UserContext = {
  dietaryPattern: "VEGETARIAN",
  allergens: ["peanuts"],
  foodDislikes: [],
  cuisineRegions: ["NORTH_INDIAN", "PAN_INDIAN"],
  cookingSkill: "EASY" as any,
  budgetMax: 100,
  timeMinutes: 30,
  mealType: "DINNER",
  pantryIngredients: ["Rice", "Moong Dal", "Onion"],
  goals: ["save_money", "eat_healthy"],
};

describe("Recommendation Engine", () => {
  it("strictly excludes recipes containing user allergens", () => {
    const scored = scoreRecipe(sampleRecipes[1], vegetarianUser); // Poha with peanuts
    assert.strictEqual(scored.isPassing, false);
    assert.strictEqual(scored.subscores.allergenSafety, 0);
  });

  it("strictly filters non-vegetarian recipes for vegetarian users", () => {
    const scored = scoreRecipe(sampleRecipes[2], vegetarianUser); // Chicken curry
    assert.strictEqual(scored.isPassing, false);
  });

  it("scores suitable recipes highly with explainable reasons", () => {
    const scored = scoreRecipe(sampleRecipes[0], vegetarianUser); // Khichdi
    assert.strictEqual(scored.isPassing, true);
    assert.ok(scored.totalScore > 50);
    assert.ok(scored.humanReasons.length > 0);
  });

  it("returns top-N ranked results sorted by total score", () => {
    const results = getTopRecommendations(sampleRecipes, vegetarianUser, 3);
    assert.strictEqual(results.length, 1); // Only khichdi passes (poha has allergen peanut, chicken is non-veg)
    assert.strictEqual(results[0].recipe.slug, "moong-dal-khichdi");
    assert.strictEqual(results[0].rank, 1);
  });
});
