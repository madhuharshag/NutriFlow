"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  IndianRupee,
  ChefHat,
  Utensils,
  ArrowRight,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

type MealType = "BREAKFAST" | "LUNCH" | "SNACK" | "DINNER";
type TimeOption = { label: string; value: number };
type BudgetOption = { label: string; value: number };
type EffortOption = { label: string; value: "VERY_EASY" | "EASY" | "MODERATE" };
type MoodOption = { label: string; value: string };

// ── Options ──────────────────────────────────────────────────────────────────

const mealTypes: { label: string; value: MealType; emoji: string }[] = [
  { label: "Breakfast", value: "BREAKFAST", emoji: "🌅" },
  { label: "Lunch", value: "LUNCH", emoji: "☀️" },
  { label: "Snack", value: "SNACK", emoji: "🍎" },
  { label: "Dinner", value: "DINNER", emoji: "🌙" },
];

const timeOptions: TimeOption[] = [
  { label: "< 10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "20 min", value: 20 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60+ min", value: 60 },
];

const budgetOptions: BudgetOption[] = [
  { label: "Under ₹50", value: 50 },
  { label: "₹50–₹100", value: 100 },
  { label: "₹100–₹150", value: 150 },
  { label: "₹150+", value: 200 },
];

const effortOptions: EffortOption[] = [
  { label: "Very easy", value: "VERY_EASY" },
  { label: "Easy", value: "EASY" },
  { label: "Moderate", value: "MODERATE" },
];

const moodOptions: MoodOption[] = [
  { label: "Something light 🥗", value: "light" },
  { label: "Something filling 🍛", value: "filling" },
  { label: "I have leftovers 🍱", value: "leftovers" },
  { label: "Minimal cooking 😴", value: "no_cook" },
];

const commonIngredients = [
  "Rice", "Atta", "Dal", "Oats", "Poha", "Bread", "Eggs", "Milk",
  "Curd", "Paneer", "Tofu", "Onion", "Tomato", "Potato",
  "Seasonal vegetables", "Peanuts", "Chana", "Spices", "Cooking oil",
  "Ginger", "Garlic", "Lemon", "Coriander", "Green chilli",
];

// ── Chip Component ────────────────────────────────────────────────────────────

function Chip<T extends string | number>({
  label,
  value,
  selected,
  onClick,
}: {
  label: string;
  value: T;
  selected: boolean;
  onClick: (v: T) => void;
}) {
  return (
    <button
      type="button"
      className={cn("chip", selected && "chip-selected")}
      onClick={() => onClick(value)}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

// ── Main Form ─────────────────────────────────────────────────────────────────

export default function PlanPage() {
  const router = useRouter();

  const [mealType, setMealType] = useState<MealType>("LUNCH");
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [budget, setBudget] = useState<number>(100);
  const [effort, setEffort] = useState<"VERY_EASY" | "EASY" | "MODERATE">("EASY");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleIngredient(ing: string) {
    setSelectedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  }

  function toggleMood(mood: string) {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  }

  const filteredIngredients = commonIngredients.filter((ing) =>
    ing.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // Build query params for recommendation page
    const params = new URLSearchParams({
      mealType,
      timeLimit: String(timeLimit),
      budget: String(budget),
      effort,
      ingredients: selectedIngredients.join(","),
      moods: selectedMoods.join(","),
    });

    router.push(`/recommendations?${params.toString()}`);
  }

  return (
    <div className="container-app py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title mb-1">Plan my next meal</h1>
        <p className="text-text-muted">
          Tell us your situation and we'll find practical options for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* ── Meal Type ── */}
        <section className="card p-5 mb-4" aria-labelledby="meal-type-heading">
          <h2
            id="meal-type-heading"
            className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide"
          >
            What meal is this for?
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {mealTypes.map((m) => (
              <button
                key={m.value}
                type="button"
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-sm font-medium",
                  mealType === m.value
                    ? "border-brand-green bg-status-success-bg text-brand-green"
                    : "border-border text-text-muted hover:border-brand-green/50 hover:text-text-secondary"
                )}
                onClick={() => setMealType(m.value)}
                aria-pressed={mealType === m.value}
              >
                <span className="text-2xl" aria-hidden="true">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Time ── */}
        <section className="card p-5 mb-4" aria-labelledby="time-heading">
          <h2
            id="time-heading"
            className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide"
          >
            <Clock className="inline w-4 h-4 mr-1.5" aria-hidden="true" />
            How much time do you have?
          </h2>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map((t) => (
              <Chip
                key={t.value}
                label={t.label}
                value={t.value}
                selected={timeLimit === t.value}
                onClick={setTimeLimit}
              />
            ))}
          </div>
        </section>

        {/* ── Budget ── */}
        <section className="card p-5 mb-4" aria-labelledby="budget-heading">
          <h2
            id="budget-heading"
            className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide"
          >
            <IndianRupee className="inline w-4 h-4 mr-1.5" aria-hidden="true" />
            Budget for this meal?
          </h2>
          <div className="flex flex-wrap gap-2">
            {budgetOptions.map((b) => (
              <Chip
                key={b.value}
                label={b.label}
                value={b.value}
                selected={budget === b.value}
                onClick={setBudget}
              />
            ))}
          </div>
        </section>

        {/* ── Effort ── */}
        <section className="card p-5 mb-4" aria-labelledby="effort-heading">
          <h2
            id="effort-heading"
            className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide"
          >
            <ChefHat className="inline w-4 h-4 mr-1.5" aria-hidden="true" />
            How much effort are you up for?
          </h2>
          <div className="flex flex-wrap gap-2">
            {effortOptions.map((e) => (
              <Chip
                key={e.value}
                label={e.label}
                value={e.value}
                selected={effort === e.value}
                onClick={setEffort}
              />
            ))}
          </div>
        </section>

        {/* ── Ingredients ── */}
        <section className="card p-5 mb-4" aria-labelledby="ingredients-heading">
          <h2
            id="ingredients-heading"
            className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide"
          >
            What do you have right now?{" "}
            <span className="text-text-placeholder font-normal normal-case">
              (optional — helps us prioritize pantry meals)
            </span>
          </h2>

          {/* Search */}
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              className="input pl-9 text-sm"
              placeholder="Search ingredients…"
              value={ingredientSearch}
              onChange={(e) => setIngredientSearch(e.target.value)}
              aria-label="Search pantry ingredients"
            />
          </div>

          {/* Selected chips */}
          {selectedIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedIngredients.map((ing) => (
                <button
                  key={ing}
                  type="button"
                  className="chip chip-selected text-xs gap-1"
                  onClick={() => toggleIngredient(ing)}
                  aria-label={`Remove ${ing}`}
                >
                  {ing}
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {/* Ingredient grid */}
          <div className="flex flex-wrap gap-1.5">
            {filteredIngredients
              .filter((ing) => !selectedIngredients.includes(ing))
              .map((ing) => (
                <button
                  key={ing}
                  type="button"
                  className="chip text-xs"
                  onClick={() => toggleIngredient(ing)}
                  aria-label={`Add ${ing} to ingredients`}
                >
                  {ing}
                </button>
              ))}
          </div>
        </section>

        {/* ── Mood / Context ── */}
        <section className="card p-5 mb-6" aria-labelledby="mood-heading">
          <h2
            id="mood-heading"
            className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide"
          >
            Anything else?{" "}
            <span className="text-text-placeholder font-normal normal-case">
              (optional)
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((m) => (
              <button
                key={m.value}
                type="button"
                className={cn("chip", selectedMoods.includes(m.value) && "chip-selected")}
                onClick={() => toggleMood(m.value)}
                aria-pressed={selectedMoods.includes(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Submit ── */}
        <button
          type="submit"
          className={cn("btn-primary btn-xl w-full", loading && "opacity-70")}
          disabled={loading}
          aria-busy={loading}
          id="find-meals-btn"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Finding meals for you…
            </>
          ) : (
            <>
              <Utensils className="w-5 h-5" aria-hidden="true" />
              Find meals for me
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
