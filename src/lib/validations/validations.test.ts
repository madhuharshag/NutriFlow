import { describe, it } from "node:test";
import assert from "node:assert";
import { onboardingSchema } from "./onboarding.ts";
import {
  addPantryItemSchema,
  updatePantryItemSchema,
  addGroceryItemSchema,
  updateProfileSchema,
} from "./api.ts";
import { recommendationRequestSchema } from "./recommendations.ts";

describe("Validation Schemas", () => {
  describe("onboardingSchema", () => {
    it("applies sensible defaults for empty onboarding input", () => {
      const parsed = onboardingSchema.parse({});
      assert.strictEqual(parsed.dietaryPattern, "VEGETARIAN");
      assert.strictEqual(parsed.cookingSkill, "BEGINNER");
      assert.strictEqual(parsed.budgetMin, 30);
      assert.strictEqual(parsed.budgetMax, 150);
      assert.strictEqual(parsed.timeMinutes, 30);
      assert.deepStrictEqual(parsed.cuisineRegions, ["PAN_INDIAN"]);
    });

    it("accepts valid custom onboarding input", () => {
      const input = {
        dietaryPattern: "VEGAN",
        allergens: ["peanuts", "dairy"],
        foodDislikes: ["bitter gourd"],
        cuisineRegions: ["SOUTH_INDIAN", "WEST_INDIAN"],
        cookingSkill: "COMFORTABLE",
        budgetMin: 50,
        budgetMax: 200,
        timeMinutes: 45,
        goals: ["save_money", "cook_more"],
        pantryIngredients: ["Rice", "Moong Dal"],
      };
      const parsed = onboardingSchema.parse(input);
      assert.strictEqual(parsed.dietaryPattern, "VEGAN");
      assert.strictEqual(parsed.budgetMax, 200);
      assert.strictEqual(parsed.allergens.length, 2);
    });

    it("rejects invalid dietary pattern", () => {
      assert.throws(() => {
        onboardingSchema.parse({ dietaryPattern: "CARNIVORE" });
      });
    });
  });

  describe("addPantryItemSchema", () => {
    it("validates valid pantry items", () => {
      const parsed = addPantryItemSchema.parse({
        name: "Basmati Rice",
        isLow: false,
        notes: "1kg bag in cabinet",
      });
      assert.strictEqual(parsed.name, "Basmati Rice");
      assert.strictEqual(parsed.isLow, false);
    });

    it("rejects empty name", () => {
      assert.throws(() => {
        addPantryItemSchema.parse({ name: "" });
      });
    });
  });

  describe("updatePantryItemSchema", () => {
    it("accepts partial updates", () => {
      const parsed = updatePantryItemSchema.parse({ isLow: true });
      assert.strictEqual(parsed.isLow, true);
    });
  });

  describe("addGroceryItemSchema", () => {
    it("assigns OTHER category as default", () => {
      const parsed = addGroceryItemSchema.parse({ name: "Coriander seeds" });
      assert.strictEqual(parsed.category, "OTHER");
      assert.strictEqual(parsed.name, "Coriander seeds");
    });

    it("validates recognized grocery categories", () => {
      const parsed = addGroceryItemSchema.parse({
        name: "Spinach",
        category: "VEGETABLES",
        quantity: "2",
        unit: "bunches",
      });
      assert.strictEqual(parsed.category, "VEGETABLES");
    });
  });

  describe("updateProfileSchema", () => {
    it("validates partial profile updates", () => {
      const parsed = updateProfileSchema.parse({
        displayName: "Chef Harsha",
        cookingSkill: "CONFIDENT",
        budgetMax: 300,
      });
      assert.strictEqual(parsed.displayName, "Chef Harsha");
      assert.strictEqual(parsed.cookingSkill, "CONFIDENT");
      assert.strictEqual(parsed.budgetMax, 300);
    });
  });

  describe("recommendationRequestSchema", () => {
    it("sets default mealType and limit", () => {
      const parsed = recommendationRequestSchema.parse({});
      assert.strictEqual(parsed.mealType, "DINNER");
      assert.strictEqual(parsed.limit, 5);
      assert.strictEqual(parsed.preferredMood, "comfort");
    });

    it("clamps limit properly", () => {
      assert.throws(() => {
        recommendationRequestSchema.parse({ limit: 0 });
      });
      assert.throws(() => {
        recommendationRequestSchema.parse({ limit: 25 });
      });
    });
  });
});
