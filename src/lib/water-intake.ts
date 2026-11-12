/**
 * Daily Water Intake Recommendation Utility
 * Accounts for body weight, activity level, and hot/humid climate factors typical in India.
 */

export interface WaterIntakeParams {
  weightKg: number;
  activityMinutesPerDay?: number;
  isHotClimate?: boolean;
}

export function calculateDailyWaterMl({
  weightKg,
  activityMinutesPerDay = 0,
  isHotClimate = false,
}: WaterIntakeParams): number {
  if (weightKg <= 0) {
    throw new Error("Weight must be greater than zero");
  }

  // Base baseline: 35 ml per kg of body weight
  let totalMl = weightKg * 35;

  // Add 350 ml for every 30 minutes of moderate/high activity
  if (activityMinutesPerDay > 0) {
    totalMl += (activityMinutesPerDay / 30) * 350;
  }

  // Hot/humid climate adds a 15% increase to account for perspiration
  if (isHotClimate) {
    totalMl *= 1.15;
  }

  // Round to nearest 50 ml for practical guidance
  return Math.round(totalMl / 50) * 50;
}

export function mlToGlasses(ml: number, glassSizeMl = 250): number {
  if (glassSizeMl <= 0) return 0;
  return Math.round((ml / glassSizeMl) * 10) / 10;
}
