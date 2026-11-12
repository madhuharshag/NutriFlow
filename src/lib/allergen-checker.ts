/**
 * Standalone Allergen & Dietary Pattern Conflict Checker
 */

const ROOT_VEGETABLES = new Set([
  "onion",
  "garlic",
  "potato",
  "potatoes",
  "carrot",
  "carrots",
  "radish",
  "ginger",
  "beetroot",
]);

const NON_VEG_KEYWORDS = new Set([
  "chicken",
  "mutton",
  "fish",
  "prawn",
  "prawns",
  "egg",
  "eggs",
  "lamb",
  "beef",
  "pork",
]);

const DAIRY_KEYWORDS = new Set([
  "milk",
  "ghee",
  "paneer",
  "butter",
  "curd",
  "yogurt",
  "cream",
  "cheese",
]);

export interface SafetyCheckResult {
  isSafe: boolean;
  conflicts: string[];
}

export function checkDietaryConflicts(
  ingredientNames: string[],
  dietaryPattern: string
): SafetyCheckResult {
  const conflicts: string[] = [];
  const normalized = ingredientNames.map((i) => i.trim().toLowerCase());

  if (dietaryPattern === "JAIN_FRIENDLY") {
    for (const ing of normalized) {
      if (ROOT_VEGETABLES.has(ing)) {
        conflicts.push(`Contains root vegetable (${ing}) not permitted in Jain diet`);
      }
      if (NON_VEG_KEYWORDS.has(ing)) {
        conflicts.push(`Contains non-vegetarian ingredient (${ing})`);
      }
    }
  } else if (dietaryPattern === "VEGAN") {
    for (const ing of normalized) {
      if (DAIRY_KEYWORDS.has(ing)) {
        conflicts.push(`Contains dairy product (${ing}) not permitted in vegan diet`);
      }
      if (NON_VEG_KEYWORDS.has(ing)) {
        conflicts.push(`Contains animal product (${ing})`);
      }
    }
  } else if (dietaryPattern === "VEGETARIAN") {
    for (const ing of normalized) {
      if (NON_VEG_KEYWORDS.has(ing)) {
        conflicts.push(`Contains non-vegetarian ingredient (${ing})`);
      }
    }
  }

  return {
    isSafe: conflicts.length === 0,
    conflicts,
  };
}

export function checkAllergenConflicts(
  ingredientNames: string[],
  allergenTags: string[],
  userAllergens: string[]
): SafetyCheckResult {
  const conflicts: string[] = [];
  const userAllergenSet = new Set(userAllergens.map((a) => a.trim().toLowerCase()));

  for (const tag of allergenTags) {
    if (userAllergenSet.has(tag.trim().toLowerCase())) {
      conflicts.push(`Direct allergen tag match: ${tag}`);
    }
  }

  for (const ing of ingredientNames) {
    const lower = ing.trim().toLowerCase();
    for (const allergen of userAllergenSet) {
      if (lower.includes(allergen)) {
        conflicts.push(`Ingredient '${ing}' matches allergen '${allergen}'`);
      }
    }
  }

  const uniqueConflicts = Array.from(new Set(conflicts));
  return {
    isSafe: uniqueConflicts.length === 0,
    conflicts: uniqueConflicts,
  };
}
