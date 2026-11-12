/**
 * Grocery list item consolidation and unit normalization utility
 */

export interface RawGroceryInput {
  name: string;
  quantity?: number | string;
  unit?: string;
  category?: string;
}

export interface ConsolidatedGroceryItem {
  name: string;
  totalQuantity: number | null;
  unit: string;
  category: string;
  sourceCount: number;
}

const UNIT_ALIASES: Record<string, string> = {
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  cup: "cup",
  cups: "cup",
  katori: "cup",
  katoris: "cup",
  g: "g",
  gram: "g",
  grams: "g",
  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",
  ml: "ml",
  milliliter: "ml",
  l: "l",
  liter: "l",
  liters: "l",
  piece: "piece",
  pieces: "piece",
  bunch: "bunch",
  bunches: "bunch",
};

export function normalizeUnit(unit?: string): string {
  if (!unit) return "";
  const cleaned = unit.trim().toLowerCase();
  return UNIT_ALIASES[cleaned] || cleaned;
}

export function parseQuantity(raw?: number | string): number | null {
  if (typeof raw === "number") return isNaN(raw) ? null : raw;
  if (!raw) return null;
  const match = String(raw).trim().match(/^(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const parsed = parseFloat(match[1]);
  return isNaN(parsed) ? null : parsed;
}

export function consolidateGroceryItems(items: RawGroceryInput[]): ConsolidatedGroceryItem[] {
  const map = new Map<string, ConsolidatedGroceryItem>();

  for (const item of items) {
    const trimmedName = item.name.trim();
    if (!trimmedName) continue;

    const normalizedName = trimmedName.toLowerCase();
    const unit = normalizeUnit(item.unit);
    const qty = parseQuantity(item.quantity);
    const key = `${normalizedName}::${unit}`;

    const existing = map.get(key);
    if (existing) {
      existing.sourceCount += 1;
      if (existing.totalQuantity !== null && qty !== null) {
        existing.totalQuantity += qty;
      } else if (qty !== null) {
        existing.totalQuantity = qty;
      }
    } else {
      map.set(key, {
        name: trimmedName,
        totalQuantity: qty,
        unit,
        category: item.category || "OTHER",
        sourceCount: 1,
      });
    }
  }

  return Array.from(map.values());
}
