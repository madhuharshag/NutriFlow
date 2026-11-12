/**
 * Grocery list export formatters for sharing via WhatsApp, Markdown, or clipboard
 */

export interface ExportableGroceryItem {
  name: string;
  quantity?: number | string | null;
  unit?: string;
  category?: string;
  checked?: boolean;
}

export function formatGroceryMarkdown(items: ExportableGroceryItem[]): string {
  if (items.length === 0) return "*Your grocery list is empty.*";

  const grouped = groupByCategory(items);
  const lines: string[] = ["# NutriFlow Grocery List", ""];

  for (const [category, catItems] of Object.entries(grouped)) {
    lines.push(`## ${category}`);
    for (const item of catItems) {
      const check = item.checked ? "[x]" : "[ ]";
      const qtyStr = formatQtyUnit(item.quantity, item.unit);
      lines.push(`- ${check} ${item.name}${qtyStr ? ` (${qtyStr})` : ""}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

export function formatGroceryWhatsApp(items: ExportableGroceryItem[]): string {
  if (items.length === 0) return "🛒 *NutriFlow Grocery List*\nList is empty.";

  const grouped = groupByCategory(items);
  const lines: string[] = ["🛒 *NutriFlow Grocery List*", ""];

  for (const [category, catItems] of Object.entries(grouped)) {
    lines.push(`*${category}:*`);
    for (const item of catItems) {
      const qtyStr = formatQtyUnit(item.quantity, item.unit);
      lines.push(`• ${item.name}${qtyStr ? ` - ${qtyStr}` : ""}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

function formatQtyUnit(qty?: number | string | null, unit?: string): string {
  if (qty === undefined || qty === null || qty === "") return unit || "";
  return unit ? `${qty} ${unit}`.trim() : String(qty);
}

function groupByCategory(items: ExportableGroceryItem[]): Record<string, ExportableGroceryItem[]> {
  const groups: Record<string, ExportableGroceryItem[]> = {};
  for (const item of items) {
    const cat = item.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  }
  return groups;
}
