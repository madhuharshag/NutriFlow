import { describe, it } from "node:test";
import assert from "node:assert";
import { checkDietaryConflicts, checkAllergenConflicts } from "./allergen-checker.ts";

describe("Allergen & Dietary Conflict Checker", () => {
  describe("checkDietaryConflicts", () => {
    it("flags root vegetables for Jain-friendly diet", () => {
      const result = checkDietaryConflicts(["Rice", "Moong Dal", "Onion", "Garlic"], "JAIN_FRIENDLY");
      assert.strictEqual(result.isSafe, false);
      assert.strictEqual(result.conflicts.length, 2);
    });

    it("passes compliant Jain ingredients", () => {
      const result = checkDietaryConflicts(["Rice", "Moong Dal", "Cumin", "Turmeric"], "JAIN_FRIENDLY");
      assert.strictEqual(result.isSafe, true);
      assert.strictEqual(result.conflicts.length, 0);
    });

    it("flags dairy products for vegan diet", () => {
      const result = checkDietaryConflicts(["Rice", "Paneer", "Ghee"], "VEGAN");
      assert.strictEqual(result.isSafe, false);
      assert.strictEqual(result.conflicts.length, 2);
    });
  });

  describe("checkAllergenConflicts", () => {
    it("identifies matching allergen tags and ingredient names", () => {
      const result = checkAllergenConflicts(
        ["Poha", "Roasted Peanuts"],
        ["peanuts"],
        ["Peanuts"]
      );
      assert.strictEqual(result.isSafe, false);
      assert.ok(result.conflicts.length >= 1);
    });

    it("passes ingredients free of user allergens", () => {
      const result = checkAllergenConflicts(
        ["Rice", "Moong Dal"],
        [],
        ["Peanuts", "Shellfish"]
      );
      assert.strictEqual(result.isSafe, true);
      assert.strictEqual(result.conflicts.length, 0);
    });
  });
});
