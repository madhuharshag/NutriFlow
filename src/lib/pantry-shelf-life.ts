/**
 * Pantry ingredient shelf life and freshness tracking utilities
 */

export const CATEGORY_SHELF_LIFE_DAYS: Record<string, number> = {
  VEGETABLE: 7,
  FRUIT: 5,
  DAIRY: 10,
  GRAIN: 180,
  PULSE: 365,
  SPICE: 365,
  OIL: 180,
  CONDIMENT: 90,
  HERB: 4,
  NUT_SEED: 120,
  SWEETENER: 365,
  PROTEIN: 3,
  OTHER: 30,
};

export function estimateShelfLifeDays(category?: string): number {
  if (!category) return CATEGORY_SHELF_LIFE_DAYS.OTHER;
  const upper = category.trim().toUpperCase();
  return CATEGORY_SHELF_LIFE_DAYS[upper] ?? CATEGORY_SHELF_LIFE_DAYS.OTHER;
}

export function isExpiringSoon(
  addedDate: Date | string,
  category?: string,
  warningThresholdDays = 2,
  currentDate = new Date()
): { isExpiring: boolean; daysRemaining: number } {
  const added = typeof addedDate === "string" ? new Date(addedDate) : addedDate;
  const shelfLife = estimateShelfLifeDays(category);
  const expirationDate = new Date(added.getTime() + shelfLife * 86_400_000);

  const diffMs = expirationDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(diffMs / 86_400_000);

  return {
    isExpiring: daysRemaining <= warningThresholdDays,
    daysRemaining,
  };
}
