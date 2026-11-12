import { describe, it } from "node:test";
import assert from "node:assert";
import { estimateBMR, estimateTDEE, calculateMacroSplit } from "./nutrition.ts";

describe("Nutrition Calculation Utilities", () => {
  describe("estimateBMR", () => {
    it("calculates male BMR correctly", () => {
      const bmr = estimateBMR({ weightKg: 70, heightCm: 175, ageYears: 25, gender: "male" });
      // 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 -> 1674
      assert.strictEqual(bmr, 1674);
    });

    it("calculates female BMR correctly", () => {
      const bmr = estimateBMR({ weightKg: 60, heightCm: 165, ageYears: 28, gender: "female" });
      // 10*60 + 6.25*165 - 5*28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25 -> 1330
      assert.strictEqual(bmr, 1330);
    });

    it("throws on invalid non-positive inputs", () => {
      assert.throws(() => estimateBMR({ weightKg: 0, heightCm: 170, ageYears: 25, gender: "male" }));
    });
  });

  describe("estimateTDEE", () => {
    it("applies activity level multiplier properly", () => {
      const bmr = 1600;
      assert.strictEqual(estimateTDEE(bmr, "sedentary"), 1920);
      assert.strictEqual(estimateTDEE(bmr, "moderate"), 2480);
    });

    it("throws on non-positive BMR", () => {
      assert.throws(() => estimateTDEE(0));
    });
  });

  describe("calculateMacroSplit", () => {
    it("returns balanced macronutrients for a 2000 kcal diet", () => {
      const macros = calculateMacroSplit(2000, "VEGETARIAN");
      assert.strictEqual(macros.proteinG, 100); // 20% = 400 kcal / 4 = 100g
      assert.strictEqual(macros.fatG, 56);      // 25% = 500 kcal / 9 = 55.5g -> 56g
      assert.strictEqual(macros.carbsG, 275);   // 55% = 1100 kcal / 4 = 275g
    });

    it("handles zero calories safely", () => {
      const macros = calculateMacroSplit(0);
      assert.deepStrictEqual(macros, { proteinG: 0, carbsG: 0, fatG: 0 });
    });
  });
});
