import { z } from "zod";

export const addPantryItemSchema = z.object({
  ingredientId: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  isLow: z.boolean().default(false),
  notes: z.string().max(255).optional(),
});

export const updatePantryItemSchema = z.object({
  isLow: z.boolean().optional(),
  notes: z.string().max(255).optional(),
});

export const addGroceryItemSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.string().max(50).optional(),
  unit: z.string().max(30).optional(),
  category: z.enum([
    "VEGETABLES",
    "FRUITS",
    "GRAINS",
    "PULSES",
    "DAIRY",
    "PROTEIN",
    "SPICES",
    "PANTRY",
    "OTHER",
  ]).default("OTHER"),
  recipeId: z.string().uuid().optional(),
});

export const updateGroceryItemSchema = z.object({
  isChecked: z.boolean().optional(),
  quantity: z.string().max(50).optional(),
  unit: z.string().max(30).optional(),
});

export const saveMealSchema = z.object({
  recipeId: z.string().uuid(),
  eventType: z.enum(["saved", "cooked", "rejected"]).default("saved"),
  mealType: z.enum(["BREAKFAST", "LUNCH", "SNACK", "DINNER"]).optional(),
  rejectedReason: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const feedbackSchema = z.object({
  recipeId: z.string().uuid(),
  action: z.enum(["like", "reject"]),
  reason: z.string().optional(),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  preferredLanguage: z.string().min(2).max(10).optional(),
  dietaryPattern: z.enum([
    "VEGETARIAN",
    "EGGETARIAN",
    "NON_VEGETARIAN",
    "VEGAN",
    "JAIN_FRIENDLY",
    "OTHER",
  ]).optional(),
  cookingSkill: z.enum(["BEGINNER", "COMFORTABLE", "CONFIDENT"]).optional(),
  budgetMin: z.number().int().min(10).max(500).optional(),
  budgetMax: z.number().int().min(20).max(1000).optional(),
  timeMinutes: z.number().int().min(5).max(180).optional(),
});
