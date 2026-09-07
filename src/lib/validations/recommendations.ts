import { z } from "zod";
import { dietaryPatternEnum, cookingSkillEnum, mealTypeEnum, cuisineRegionEnum } from "./onboarding";

export const recommendationRequestSchema = z.object({
  mealType: mealTypeEnum.default("DINNER"),
  timeLimitMinutes: z.number().int().min(5).max(180).optional(),
  budgetLimitINR: z.number().int().min(10).max(1000).optional(),
  cookingSkill: cookingSkillEnum.optional(),
  dietaryPattern: dietaryPatternEnum.optional(),
  cuisineRegions: z.array(cuisineRegionEnum).optional(),
  requiredIngredients: z.array(z.string()).default([]),
  excludedIngredients: z.array(z.string()).default([]),
  preferredMood: z.enum(["quick", "comfort", "healthy", "adventurous", "budget"]).default("comfort"),
  limit: z.number().int().min(1).max(20).default(5),
});

export type RecommendationRequestInput = z.infer<typeof recommendationRequestSchema>;
