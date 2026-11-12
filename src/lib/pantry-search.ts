/**
 * Pantry ingredient search and filtering helper
 */

export interface SearchablePantryItem {
  id: string;
  name: string;
  category?: string;
  isLow?: boolean;
}

export function searchPantryItems<T extends SearchablePantryItem>(
  items: T[],
  query: string
): T[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;

  const terms = trimmed.split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    const itemName = item.name.toLowerCase();
    const itemCat = (item.category || "").toLowerCase();

    // Must match all query tokens against either name or category
    return terms.every((term) => itemName.includes(term) || itemCat.includes(term));
  });
}
