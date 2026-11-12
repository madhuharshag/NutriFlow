import { describe, it } from "node:test";
import assert from "node:assert";
import { searchPantryItems } from "./pantry-search.ts";

describe("Pantry Search Utility", () => {
  const mockPantry = [
    { id: "1", name: "Basmati Rice", category: "GRAIN", isLow: false },
    { id: "2", name: "Moong Dal", category: "PULSE", isLow: false },
    { id: "3", name: "Mustard Seeds", category: "SPICE", isLow: true },
    { id: "4", name: "Sunflower Oil", category: "OIL", isLow: false },
  ];

  it("filters items by substring name matching", () => {
    const results = searchPantryItems(mockPantry, "rice");
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].name, "Basmati Rice");
  });

  it("filters items by category name matching", () => {
    const results = searchPantryItems(mockPantry, "pulse");
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].name, "Moong Dal");
  });

  it("supports multi-token queries", () => {
    const results = searchPantryItems(mockPantry, "mustard spice");
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].name, "Mustard Seeds");
  });

  it("returns all items when query is empty or whitespace", () => {
    assert.strictEqual(searchPantryItems(mockPantry, "").length, 4);
    assert.strictEqual(searchPantryItems(mockPantry, "   ").length, 4);
  });
});
