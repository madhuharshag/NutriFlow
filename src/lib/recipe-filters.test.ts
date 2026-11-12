import { describe, it } from "node:test";
import assert from "node:assert";
import {
  filterRecipesByMaxTime,
  filterRecipesByDifficulty,
  sortRecipesByCost,
  type FilterableRecipe,
} from "./recipe-filters.ts";

const mockRecipes: FilterableRecipe[] = [
  { id: "1", name: "Quick Poha", totalTimeMinutes: 15, difficultyLevel: "VERY_EASY", costMin: 30, costMax: 40 },
  { id: "2", name: "Khichdi", totalTimeMinutes: 25, difficultyLevel: "EASY", costMin: 40, costMax: 60 },
  { id: "3", name: "Biryani", totalTimeMinutes: 60, difficultyLevel: "MODERATE", costMin: 120, costMax: 180 },
];

describe("Recipe Filter & Sort Utilities", () => {
  it("filters recipes by max cooking time", () => {
    const under30 = filterRecipesByMaxTime(mockRecipes, 30);
    assert.strictEqual(under30.length, 2);
    assert.strictEqual(under30[0].name, "Quick Poha");
    assert.strictEqual(under30[1].name, "Khichdi");
  });

  it("filters recipes by max difficulty level", () => {
    const easyOnly = filterRecipesByDifficulty(mockRecipes, "EASY");
    assert.strictEqual(easyOnly.length, 2);
    assert.ok(easyOnly.every((r) => r.difficultyLevel === "VERY_EASY" || r.difficultyLevel === "EASY"));
  });

  it("sorts recipes by average estimated cost", () => {
    const asc = sortRecipesByCost(mockRecipes, "asc");
    assert.strictEqual(asc[0].name, "Quick Poha");
    assert.strictEqual(asc[2].name, "Biryani");

    const desc = sortRecipesByCost(mockRecipes, "desc");
    assert.strictEqual(desc[0].name, "Biryani");
  });
});
