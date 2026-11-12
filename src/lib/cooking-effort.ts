/**
 * Cooking effort and complexity scoring utility
 */

export interface EffortParams {
  ingredientCount: number;
  stepCount: number;
  totalTimeMinutes: number;
  isOnePot?: boolean;
}

export interface EffortScore {
  score: number; // 1 to 10
  tier: "LOW" | "MEDIUM" | "HIGH";
  isQuick: boolean;
  isBeginnerFriendly: boolean;
}

export function computeEffortScore({
  ingredientCount,
  stepCount,
  totalTimeMinutes,
  isOnePot = false,
}: EffortParams): EffortScore {
  let raw = 0;

  // Time weight (up to 4 points)
  if (totalTimeMinutes <= 15) raw += 1;
  else if (totalTimeMinutes <= 30) raw += 2;
  else if (totalTimeMinutes <= 45) raw += 3;
  else raw += 4;

  // Step count weight (up to 3 points)
  if (stepCount <= 3) raw += 1;
  else if (stepCount <= 6) raw += 2;
  else raw += 3;

  // Ingredient count weight (up to 3 points)
  if (ingredientCount <= 5) raw += 1;
  else if (ingredientCount <= 9) raw += 2;
  else raw += 3;

  // One-pot bonus (reduces cleanup effort by 1 point)
  if (isOnePot && raw > 1) {
    raw -= 1;
  }

  const score = Math.max(1, Math.min(10, raw));
  const tier: EffortScore["tier"] = score <= 3 ? "LOW" : score <= 6 ? "MEDIUM" : "HIGH";

  return {
    score,
    tier,
    isQuick: totalTimeMinutes <= 20,
    isBeginnerFriendly: score <= 4 && stepCount <= 4,
  };
}
