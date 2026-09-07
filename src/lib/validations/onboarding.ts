import { z } from "zod";

export const dietaryPatternEnum = z.enum([
  "VEGETARIAN",
  "EGGETARIAN",
  "NON_VEGETARIAN",
  "VEGAN",
  "JAIN_FRIENDLY",
  "OTHER",
]);

export const cookingSkillEnum = z.enum([
  "BEGINNER",
  "COMFORTABLE",
  "CONFIDENT",
]);

export const mealTypeEnum = z.enum([
  "BREAKFAST",
  "LUNCH",
  "SNACK",
  "DINNER",
]);

export const cuisineRegionEnum = z.enum([
  "NORTH_INDIAN",
  "SOUTH_INDIAN",
  "EAST_INDIAN",
  "WEST_INDIAN",
  "MIXED_INDIAN",
  "PAN_INDIAN",
  "ANY",
]);

export const onboardingSchema = z.object({
  dietaryPattern: dietaryPatternEnum.default("VEGETARIAN"),
  allergens: z.array(z.string()).default([]),
  foodDislikes: z.array(z.string()).default([]),
  cuisineRegions: z.array(cuisineRegionEnum).default(["PAN_INDIAN"]),
  cookingSkill: cookingSkillEnum.default("BEGINNER"),
  budgetMin: z.number().int().min(10).max(500).default(30),
  budgetMax: z.number().int().min(20).max(1000).default(150),
  timeMinutes: z.number().int().min(5).max(180).default(30),
  goals: z.array(z.string()).default([]),
  pantryIngredients: z.array(z.string()).default([]),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
