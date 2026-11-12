import { describe, it } from "node:test";
import assert from "node:assert";
import { estimateShelfLifeDays, isExpiringSoon } from "./pantry-shelf-life.ts";

describe("Pantry Shelf Life Utilities", () => {
  describe("estimateShelfLifeDays", () => {
    it("returns expected shelf life for staple categories", () => {
      assert.strictEqual(estimateShelfLifeDays("VEGETABLE"), 7);
      assert.strictEqual(estimateShelfLifeDays("PULSE"), 365);
      assert.strictEqual(estimateShelfLifeDays("HERB"), 4);
    });

    it("falls back to default for unknown or missing category", () => {
      assert.strictEqual(estimateShelfLifeDays(undefined), 30);
      assert.strictEqual(estimateShelfLifeDays("UNKNOWN_CAT"), 30);
    });
  });

  describe("isExpiringSoon", () => {
    it("flags produce nearing end of shelf life", () => {
      const now = new Date("2026-11-12T00:00:00Z");
      // Vegetable added 6 days ago (7 day shelf life) -> 1 day remaining
      const addedDate = new Date("2026-11-06T00:00:00Z");
      const result = isExpiringSoon(addedDate, "VEGETABLE", 2, now);
      assert.strictEqual(result.isExpiring, true);
      assert.strictEqual(result.daysRemaining, 1);
    });

    it("does not flag freshly added dry staples", () => {
      const now = new Date("2026-11-12T00:00:00Z");
      const addedDate = new Date("2026-11-10T00:00:00Z");
      const result = isExpiringSoon(addedDate, "GRAIN", 2, now);
      assert.strictEqual(result.isExpiring, false);
      assert.ok(result.daysRemaining > 100);
    });
  });
});
