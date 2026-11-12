/**
 * Recipe filtering and sorting helpers
 */

export interface FilterableRecipe {
  id: string;
  name: string;
  totalTimeMinutes: number;
  difficultyLevel: "VERY_EASY" | "EASY" | "MODERATE" | "HARD";
  costMin: number;
  costMax: number;
}

const DIFFICULTY_RANK: Record<string, number> = {
  VERY_EASY: 1,
  EASY: 2,
  MODERATE: 3,
  HARD: 4,
};

export function filterRecipesByMaxTime<T extends FilterableRecipe>(recipes: T[], maxMinutes: number): T[] {
  if (maxMinutes <= 0) return [];
  return recipes.filter((r) => r.totalTimeMinutes <= maxMinutes);
}

export function filterRecipesByDifficulty<T extends FilterableRecipe>(
  recipes: T[],
  maxDifficulty: FilterableRecipe["difficultyLevel"]
): T[] {
  const targetRank = DIFFICULTY_RANK[maxDifficulty] ?? 4;
  return recipes.filter((r) => (DIFFICULTY_RANK[r.difficultyLevel] ?? 4) <= targetRank);
}

export function sortRecipesByCost<T extends FilterableRecipe>(
  recipes: T[],
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...recipes].sort((a, b) => {
    const costA = (a.costMin + a.costMax) / 2;
    const costB = (b.costMin + b.costMax) / 2;
    return direction === "asc" ? costA - costB : costB - costA;
  });
}
