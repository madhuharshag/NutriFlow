/**
 * Daily Meal Plan Nutrition & Budget Aggregator
 */

export interface PlannedMealItem {
  recipeId?: string;
  name: string;
  mealType: "BREAKFAST" | "LUNCH" | "SNACK" | "DINNER";
  caloriesApprox?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  costMin?: number;
  costMax?: number;
}

export interface DayPlanSummary {
  mealCount: number;
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalFiberG: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  averageCost: number;
}

export function aggregateDayPlan(meals: PlannedMealItem[]): DayPlanSummary {
  const summary: DayPlanSummary = {
    mealCount: meals.length,
    totalCalories: 0,
    totalProteinG: 0,
    totalCarbsG: 0,
    totalFatG: 0,
    totalFiberG: 0,
    estimatedCostMin: 0,
    estimatedCostMax: 0,
    averageCost: 0,
  };

  for (const meal of meals) {
    summary.totalCalories += meal.caloriesApprox || 0;
    summary.totalProteinG += meal.proteinG || 0;
    summary.totalCarbsG += meal.carbsG || 0;
    summary.totalFatG += meal.fatG || 0;
    summary.totalFiberG += meal.fiberG || 0;
    summary.estimatedCostMin += meal.costMin || 0;
    summary.estimatedCostMax += meal.costMax || 0;
  }

  summary.averageCost = Math.round(
    (summary.estimatedCostMin + summary.estimatedCostMax) / 2
  );

  return summary;
}
