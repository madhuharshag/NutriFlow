"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X, AlertCircle, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";

const INGREDIENT_CATEGORIES = {
  "Grains & Staples": ["Rice", "Atta", "Poha", "Oats", "Bread", "Dalia"],
  "Pulses & Proteins": ["Dal (any)", "Chana", "Rajma", "Eggs", "Paneer", "Tofu", "Peanuts"],
  "Dairy": ["Milk", "Curd", "Butter", "Ghee"],
  "Vegetables": ["Onion", "Tomato", "Potato", "Seasonal vegetables", "Green chilli", "Carrot", "Spinach"],
  "Spices & Herbs": ["Spices", "Ginger", "Garlic", "Turmeric", "Coriander", "Cumin", "Mustard seeds"],
  "Oils & Condiments": ["Cooking oil", "Lemon", "Salt", "Sugar", "Chaat masala"],
};

interface PantryItem {
  id?: string;
  name: string;
  isLow: boolean;
  category: string;
}

export default function PantryPage() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    { name: "Rice", isLow: false, category: "Grains & Staples" },
    { name: "Dal (any)", isLow: true, category: "Pulses & Proteins" },
    { name: "Onion", isLow: false, category: "Vegetables" },
    { name: "Spices", isLow: false, category: "Spices & Herbs" },
    { name: "Cooking oil", isLow: false, category: "Oils & Condiments" },
  ]);
  const [search, setSearch] = useState("");

  // Sync with API on mount
  useEffect(() => {
    fetch("/api/pantry")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items && data.items.length > 0) {
          setPantryItems(
            data.items.map((i: any) => ({
              id: i.id,
              name: i.name,
              isLow: i.isLow,
              category: i.category || "Pantry",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  async function addIngredient(name: string, category: string) {
    if (pantryItems.some((i) => i.name.toLowerCase() === name.toLowerCase())) return;
    setPantryItems((prev) => [...prev, { name, isLow: false, category }]);

    try {
      const res = await fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, isLow: false }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.item?.id) {
          setPantryItems((prev) =>
            prev.map((i) => (i.name === name ? { ...i, id: data.item.id } : i))
          );
        }
      }
    } catch (e) {
      console.error("Failed to sync added pantry item:", e);
    }
  }

  async function removeIngredient(name: string, id?: string) {
    const item = pantryItems.find((i) => i.name === name);
    setPantryItems((prev) => prev.filter((i) => i.name !== name));

    const itemId = id || item?.id;
    if (itemId) {
      try {
        await fetch(`/api/pantry?id=${itemId}`, { method: "DELETE" });
      } catch (e) {
        console.error("Failed to delete pantry item:", e);
      }
    }
  }

  async function toggleLow(name: string, id?: string) {
    const item = pantryItems.find((i) => i.name === name);
    const newStatus = !item?.isLow;

    setPantryItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, isLow: newStatus } : i))
    );

    const itemId = id || item?.id;
    if (itemId) {
      try {
        await fetch(`/api/pantry?id=${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isLow: newStatus }),
        });
      } catch (e) {
        console.error("Failed to update pantry status:", e);
      }
    }
  }

  const pantrySet = new Set(pantryItems.map((i) => i.name));

  return (
    <div className="container-app py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBasket className="w-5 h-5 text-brand-green" aria-hidden />
          <h1 className="page-title">My Pantry</h1>
        </div>
        <p className="text-text-muted">
          Tell us what you have at home so we can suggest meals that use your
          existing ingredients.
        </p>
      </div>

      {/* Current pantry */}
      {pantryItems.length > 0 && (
        <section className="card p-5 mb-5" aria-labelledby="current-pantry-heading">
          <h2 id="current-pantry-heading" className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
            In my pantry ({pantryItems.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {pantryItems.map((item) => (
              <div
                key={item.name}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border",
                  item.isLow
                    ? "border-status-warning bg-status-warning-bg text-status-warning"
                    : "border-brand-green bg-status-success-bg text-brand-green"
                )}
              >
                {item.isLow && (
                  <AlertCircle className="w-3 h-3 shrink-0" aria-hidden />
                )}
                <span>{item.name}</span>
                {item.isLow && (
                  <span className="text-2xs">• Low</span>
                )}
                <button
                  onClick={() => toggleLow(item.name)}
                  className="ml-1 opacity-60 hover:opacity-100 transition-opacity text-2xs underline"
                  aria-label={item.isLow ? `Mark ${item.name} as in stock` : `Mark ${item.name} as low`}
                >
                  {item.isLow ? "ok" : "low"}
                </button>
                <button
                  onClick={() => removeIngredient(item.name)}
                  className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${item.name} from pantry`}
                >
                  <X className="w-3.5 h-3.5" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Add ingredients */}
      <section aria-labelledby="add-ingredients-heading">
        <h2 id="add-ingredients-heading" className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
          Add ingredients
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden />
          <input
            type="search"
            className="input pl-9"
            placeholder="Search ingredients to add…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search for ingredients to add to pantry"
          />
        </div>

        {/* Category grids */}
        <div className="flex flex-col gap-4">
          {Object.entries(INGREDIENT_CATEGORIES).map(([category, items]) => {
            const filtered = items.filter(
              (item) =>
                item.toLowerCase().includes(search.toLowerCase()) &&
                !pantrySet.has(item)
            );
            if (filtered.length === 0) return null;

            return (
              <div key={category} className="card p-4">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2.5">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filtered.map((item) => (
                    <button
                      key={item}
                      className="chip text-sm"
                      onClick={() => addIngredient(item, category)}
                      aria-label={`Add ${item} to pantry`}
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Low stock warning */}
      {pantryItems.some((i) => i.isLow) && (
        <div className="mt-5 alert-warning flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-status-warning" aria-hidden />
          <p className="text-sm text-status-warning">
            <strong>Low stock:</strong>{" "}
            {pantryItems.filter((i) => i.isLow).map((i) => i.name).join(", ")}.
            Consider adding these to your grocery list.
          </p>
        </div>
      )}
    </div>
  );
}
