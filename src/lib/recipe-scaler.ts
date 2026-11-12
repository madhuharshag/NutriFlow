/**
 * Recipe Serving Scaler Utility
 */

export interface ScalableIngredient {
  name: string;
  quantity?: number | string;
  unit?: string;
  notes?: string;
}

export interface ScalableRecipe {
  servings: number;
  costMin?: number;
  costMax?: number;
  caloriesApprox?: number;
  ingredients: ScalableIngredient[];
}

export function parseNumericQuantity(qty?: number | string): { value: number | null; suffix: string } {
  if (typeof qty === "number") return { value: qty, suffix: "" };
  if (!qty) return { value: null, suffix: "" };

  const match = String(qty).trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { value: null, suffix: String(qty) };

  const num = parseFloat(match[1]);
  return {
    value: isNaN(num) ? null : num,
    suffix: match[2].trim(),
  };
}

export function scaleRecipe<T extends ScalableRecipe>(recipe: T, targetServings: number): T {
  if (targetServings <= 0 || !recipe.servings || recipe.servings <= 0) {
    throw new Error("Invalid servings ratio");
  }

  const factor = targetServings / recipe.servings;

  const scaledIngredients = recipe.ingredients.map((ing) => {
    const { value, suffix } = parseNumericQuantity(ing.quantity);
    if (value === null) {
      return { ...ing };
    }

    const scaledNum = Math.round(value * factor * 10) / 10;
    const formattedQty = suffix ? `${scaledNum} ${suffix}`.trim() : scaledNum;

    return {
      ...ing,
      quantity: formattedQty,
    };
  });

  return {
    ...recipe,
    servings: targetServings,
    costMin: recipe.costMin !== undefined ? Math.round(recipe.costMin * factor) : undefined,
    costMax: recipe.costMax !== undefined ? Math.round(recipe.costMax * factor) : undefined,
    caloriesApprox:
      recipe.caloriesApprox !== undefined
        ? Math.round(recipe.caloriesApprox * factor)
        : undefined,
    ingredients: scaledIngredients,
  };
}
