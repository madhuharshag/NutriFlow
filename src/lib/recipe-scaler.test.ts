import { describe, it } from "node:test";
import assert from "node:assert";
import { scaleRecipe, parseNumericQuantity } from "./recipe-scaler.ts";

describe("Recipe Serving Scaler", () => {
  it("scales ingredients and estimated costs proportionally", () => {
    const baseRecipe = {
      servings: 2,
      costMin: 40,
      costMax: 60,
      caloriesApprox: 300,
      ingredients: [
        { name: "Rice", quantity: 1, unit: "cup" },
        { name: "Moong Dal", quantity: 0.5, unit: "cup" },
        { name: "Salt", quantity: "to taste", unit: "" },
      ],
    };

    const scaled = scaleRecipe(baseRecipe, 4);
    assert.strictEqual(scaled.servings, 4);
    assert.strictEqual(scaled.costMin, 80);
    assert.strictEqual(scaled.costMax, 120);
    assert.strictEqual(scaled.caloriesApprox, 600);
    assert.strictEqual(scaled.ingredients[0].quantity, 2);
    assert.strictEqual(scaled.ingredients[1].quantity, 1);
    assert.strictEqual(scaled.ingredients[2].quantity, "to taste");
  });

  it("handles downsizing servings accurately", () => {
    const baseRecipe = {
      servings: 4,
      costMin: 100,
      costMax: 150,
      ingredients: [{ name: "Paneer", quantity: 200, unit: "g" }],
    };

    const scaled = scaleRecipe(baseRecipe, 2);
    assert.strictEqual(scaled.servings, 2);
    assert.strictEqual(scaled.costMin, 50);
    assert.strictEqual(scaled.costMax, 75);
    assert.strictEqual(scaled.ingredients[0].quantity, 100);
  });

  it("throws on invalid target servings", () => {
    const baseRecipe = { servings: 2, ingredients: [] };
    assert.throws(() => scaleRecipe(baseRecipe, 0));
  });

  it("parses numeric and string quantity representations cleanly", () => {
    assert.deepStrictEqual(parseNumericQuantity(2.5), { value: 2.5, suffix: "" });
    assert.deepStrictEqual(parseNumericQuantity("300 g"), { value: 300, suffix: "g" });
    assert.deepStrictEqual(parseNumericQuantity("to taste"), { value: null, suffix: "to taste" });
    assert.deepStrictEqual(parseNumericQuantity(undefined), { value: null, suffix: "" });
  });
});
