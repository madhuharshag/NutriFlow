import { describe, it } from "node:test";
import assert from "node:assert";
import { formatGroceryMarkdown, formatGroceryWhatsApp } from "./grocery-export.ts";

describe("Grocery Export Formatters", () => {
  const items = [
    { name: "Tomato", quantity: 3, unit: "pieces", category: "Vegetables", checked: false },
    { name: "Toor Dal", quantity: 500, unit: "g", category: "Pulses", checked: true },
  ];

  it("formats markdown checklist with category headers", () => {
    const md = formatGroceryMarkdown(items);
    assert.ok(md.includes("# NutriFlow Grocery List"));
    assert.ok(md.includes("## Vegetables"));
    assert.ok(md.includes("- [ ] Tomato (3 pieces)"));
    assert.ok(md.includes("## Pulses"));
    assert.ok(md.includes("- [x] Toor Dal (500 g)"));
  });

  it("formats WhatsApp friendly bolded bullet lists", () => {
    const wa = formatGroceryWhatsApp(items);
    assert.ok(wa.includes("*NutriFlow Grocery List*"));
    assert.ok(wa.includes("*Vegetables:*"));
    assert.ok(wa.includes("• Tomato - 3 pieces"));
    assert.ok(wa.includes("*Pulses:*"));
  });

  it("handles empty grocery list gracefully", () => {
    assert.strictEqual(formatGroceryMarkdown([]), "*Your grocery list is empty.*");
    assert.ok(formatGroceryWhatsApp([]).includes("List is empty"));
  });
});
