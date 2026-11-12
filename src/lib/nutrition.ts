/**
 * Deterministic Nutrition & Calorie Calculation Utilities
 */

export interface BMRParams {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: "male" | "female" | "other";
}

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/**
 * Calculates Basal Metabolic Rate using Mifflin-St Jeor equation.
 */
export function estimateBMR({ weightKg, heightCm, ageYears, gender }: BMRParams): number {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) {
    throw new Error("Invalid parameters for BMR estimation");
  }

  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  if (gender === "male") {
    return Math.round(base + 5);
  }
  if (gender === "female") {
    return Math.round(base - 161);
  }
  // Neutral baseline between male and female
  return Math.round(base - 78);
}

/**
 * Calculates Total Daily Energy Expenditure based on activity level.
 */
export function estimateTDEE(bmr: number, activityLevel: ActivityLevel = "sedentary"): number {
  if (bmr <= 0) throw new Error("BMR must be positive");
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Suggests macronutrient breakdown (in grams) for a daily caloric target.
 */
export function calculateMacroSplit(totalCalories: number, dietaryPattern = "VEGETARIAN"): {
  proteinG: number;
  carbsG: number;
  fatG: number;
} {
  if (totalCalories <= 0) {
    return { proteinG: 0, carbsG: 0, fatG: 0 };
  }

  // Protein ratio adjusts slightly based on diet pattern
  const isHighProtein = dietaryPattern === "NON_VEGETARIAN" || dietaryPattern === "EGGETARIAN";
  const proteinPct = isHighProtein ? 0.25 : 0.2;
  const fatPct = 0.25;
  const carbsPct = 1 - proteinPct - fatPct;

  return {
    proteinG: Math.round((totalCalories * proteinPct) / 4),
    carbsG: Math.round((totalCalories * carbsPct) / 4),
    fatG: Math.round((totalCalories * fatPct) / 9),
  };
}
