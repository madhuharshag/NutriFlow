import { describe, it } from "node:test";
import assert from "node:assert";
import { normalizeUnit, parseQuantity, consolidateGroceryItems } from "./grocery.ts";

describe("Grocery Consolidation Utilities", () => {
  describe("normalizeUnit", () => {
    it("maps common abbreviations and plurals to canonical units", () => {
      assert.strictEqual(normalizeUnit("tablespoon"), "tbsp");
      assert.strictEqual(normalizeUnit("Tbsp"), "tbsp");
      assert.strictEqual(normalizeUnit("katoris"), "cup");
      assert.strictEqual(normalizeUnit("grams"), "g");
    });

    it("returns empty string for missing units", () => {
      assert.strictEqual(normalizeUnit(undefined), "");
      assert.strictEqual(normalizeUnit(""), "");
    });
  });

  describe("parseQuantity", () => {
    it("parses numbers and leading numeric strings", () => {
      assert.strictEqual(parseQuantity(2.5), 2.5);
      assert.strictEqual(parseQuantity("2 cups"), 2);
      assert.strictEqual(parseQuantity("1.5 kg"), 1.5);
    });

    it("returns null for non-numeric strings", () => {
      assert.strictEqual(parseQuantity("to taste"), null);
      assert.strictEqual(parseQuantity(""), null);
    });
  });

  describe("consolidateGroceryItems", () => {
    it("combines duplicate ingredients with compatible units", () => {
      const items = [
        { name: "Onion", quantity: "2", unit: "piece", category: "VEGETABLES" },
        { name: "onion", quantity: "3", unit: "pieces", category: "VEGETABLES" },
        { name: "Moong Dal", quantity: 200, unit: "g", category: "PULSES" },
      ];

      const consolidated = consolidateGroceryItems(items);
      assert.strictEqual(consolidated.length, 2);

      const onion = consolidated.find((i) => i.name.toLowerCase() === "onion");
      assert.ok(onion);
      assert.strictEqual(onion.totalQuantity, 5);
      assert.strictEqual(onion.unit, "piece");
      assert.strictEqual(onion.sourceCount, 2);
    });

    it("keeps distinct units separate", () => {
      const items = [
        { name: "Coriander", quantity: "1", unit: "bunch" },
        { name: "Coriander", quantity: "50", unit: "g" },
      ];
      const consolidated = consolidateGroceryItems(items);
      assert.strictEqual(consolidated.length, 2);
    });
  });
});
