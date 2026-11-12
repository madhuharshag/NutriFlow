import { describe, it } from "node:test";
import assert from "node:assert";
import { aggregateDayPlan, type PlannedMealItem } from "./plan-aggregator.ts";

describe("Meal Plan Aggregator", () => {
  it("sums daily calories, macros, and estimated budget ranges", () => {
    const meals: PlannedMealItem[] = [
      {
        name: "Poha",
        mealType: "BREAKFAST",
        caloriesApprox: 320,
        proteinG: 8,
        carbsG: 55,
        fatG: 7,
        fiberG: 4,
        costMin: 30,
        costMax: 45,
      },
      {
        name: "Khichdi",
        mealType: "LUNCH",
        caloriesApprox: 380,
        proteinG: 14,
        carbsG: 62,
        fatG: 8,
        fiberG: 7,
        costMin: 40,
        costMax: 60,
      },
    ];

    const summary = aggregateDayPlan(meals);
    assert.strictEqual(summary.mealCount, 2);
    assert.strictEqual(summary.totalCalories, 700);
    assert.strictEqual(summary.totalProteinG, 22);
    assert.strictEqual(summary.totalCarbsG, 117);
    assert.strictEqual(summary.totalFatG, 15);
    assert.strictEqual(summary.totalFiberG, 11);
    assert.strictEqual(summary.estimatedCostMin, 70);
    assert.strictEqual(summary.estimatedCostMax, 105);
    assert.strictEqual(summary.averageCost, 88);
  });

  it("handles empty meal plan cleanly", () => {
    const summary = aggregateDayPlan([]);
    assert.strictEqual(summary.mealCount, 0);
    assert.strictEqual(summary.totalCalories, 0);
    assert.strictEqual(summary.averageCost, 0);
  });
});
