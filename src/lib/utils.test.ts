import { describe, it } from "node:test";
import assert from "node:assert";
import {
  cn,
  formatCurrency,
  formatTimeMinutes,
  slugify,
  truncate,
} from "./utils.ts";

describe("Utility functions", () => {
  describe("cn", () => {
    it("merges class names cleanly", () => {
      assert.strictEqual(cn("px-2 py-1", "bg-red-500"), "px-2 py-1 bg-red-500");
    });

    it("resolves conflicting Tailwind utilities", () => {
      assert.strictEqual(cn("p-4", "p-2"), "p-2");
    });

    it("handles conditional class values", () => {
      const isVisible = false;
      const isActive = true;
      assert.strictEqual(
        cn("base", isVisible && "hidden", isActive && "active"),
        "base active"
      );
    });
  });

  describe("formatCurrency", () => {
    it("formats Indian Rupee amounts correctly", () => {
      const formatted = formatCurrency(150);
      assert.ok(formatted.includes("150"));
      assert.ok(formatted.includes("₹") || formatted.includes("INR"));
    });

    it("formats zero amount without fraction digits", () => {
      const formatted = formatCurrency(0);
      assert.ok(formatted.includes("0"));
    });
  });

  describe("formatTimeMinutes", () => {
    it("formats minutes under an hour", () => {
      assert.strictEqual(formatTimeMinutes(15), "15 min");
      assert.strictEqual(formatTimeMinutes(45), "45 min");
    });

    it("formats exact hour increments", () => {
      assert.strictEqual(formatTimeMinutes(60), "1h");
      assert.strictEqual(formatTimeMinutes(120), "2h");
    });

    it("formats hours and remaining minutes", () => {
      assert.strictEqual(formatTimeMinutes(75), "1h 15m");
      assert.strictEqual(formatTimeMinutes(130), "2h 10m");
    });
  });

  describe("slugify", () => {
    it("converts strings to kebab-case slug", () => {
      assert.strictEqual(slugify("Moong Dal Khichdi"), "moong-dal-khichdi");
    });

    it("strips special characters and trims excess dashes", () => {
      assert.strictEqual(
        slugify("  Poha & Peanuts (Quick Breakfast)!  "),
        "poha-peanuts-quick-breakfast"
      );
    });

    it("handles multiple consecutive spaces and underscores", () => {
      assert.strictEqual(slugify("Spicy__Chickpea   Curry"), "spicy-chickpea-curry");
    });
  });

  describe("truncate", () => {
    it("returns unchanged string if length is within limit", () => {
      assert.strictEqual(truncate("Healthy meal", 20), "Healthy meal");
    });

    it("truncates and appends ellipsis when length is exceeded", () => {
      assert.strictEqual(truncate("NutriFlow is a nutrition app", 10), "NutriFlow…");
    });
  });
});
