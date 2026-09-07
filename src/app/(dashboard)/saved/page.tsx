"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Clock, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock saved recipes
const MOCK_SAVED_RECIPES = [
  {
    id: "r1",
    slug: "moong-dal-khichdi",
    name: "Moong Dal Khichdi",
    time: "25 min",
    mealTypes: ["Lunch", "Dinner"],
    emoji: "🍲",
    gradient: "from-amber-400 via-yellow-300 to-orange-300",
  },
  {
    id: "r2",
    slug: "poha-peanuts",
    name: "Poha with Peanuts",
    time: "15 min",
    mealTypes: ["Breakfast", "Snack"],
    emoji: "🥘",
    gradient: "from-yellow-300 via-amber-200 to-lime-200",
  },
];

export default function SavedMealsPage() {
  const [recipes, setRecipes] = useState(MOCK_SAVED_RECIPES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/saved")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.savedMeals && data.savedMeals.length > 0) {
          setRecipes(
            data.savedMeals.map((m: any) => ({
              id: m.id,
              slug: m.slug,
              name: m.name,
              time: `${m.totalTimeMinutes || 20} min`,
              mealTypes: (m.mealTypes || []).map((t: string) =>
                t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
              ),
              emoji: "🍲",
              gradient: "from-amber-400 via-yellow-300 to-orange-300",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const filters = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || recipe.mealTypes.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const removeRecipe = async (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    try {
      await fetch(`/api/saved?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete saved meal:", e);
    }
  };

  return (
    <div className="container-app py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-5 h-5 text-brand-green" aria-hidden />
          <h1 className="page-title">Saved Meals</h1>
        </div>
        <p className="text-text-muted">
          Your personal collection of favorite recipes and go-to meals.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden />
          <input
            type="search"
            className="input pl-9"
            placeholder="Search saved meals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search saved meals"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "chip whitespace-nowrap",
                filter === f && "chip-selected"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="card p-8 text-center border-dashed">
          <div className="text-4xl mb-4" aria-hidden>🔍</div>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            No saved meals found
          </h2>
          <p className="text-text-muted text-sm">
            {search || filter !== "All"
              ? "Try adjusting your search or filters."
              : "When you find meals you like, save them and they'll appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe, index) => (
            <div 
              key={recipe.id} 
              className="card group overflow-hidden animate-fade-in flex flex-col"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Link href={`/recipes/${recipe.slug}`} className="block relative h-32 bg-gradient-to-br flex items-center justify-center">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", recipe.gradient)} />
                <span className="text-5xl relative z-10">{recipe.emoji}</span>
              </Link>
              
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/recipes/${recipe.slug}`}>
                    <h3 className="font-bold text-text-primary hover:text-brand-green transition-colors line-clamp-1">
                      {recipe.name}
                    </h3>
                  </Link>
                  <button 
                    onClick={() => removeRecipe(recipe.id)}
                    className="text-text-placeholder hover:text-status-error p-1 -mr-1 -mt-1 rounded transition-colors"
                    aria-label={`Remove ${recipe.name} from saved meals`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {recipe.mealTypes.map(type => (
                    <span key={type} className="badge bg-surface-muted text-text-secondary text-2xs">
                      {type}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-border-muted flex items-center gap-1.5 text-xs text-text-muted font-medium">
                  <Clock className="w-3.5 h-3.5 text-brand-green" aria-hidden />
                  {recipe.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
