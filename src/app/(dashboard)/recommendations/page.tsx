"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  IndianRupee,
  ChefHat,
  Check,
  Bookmark,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Info,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScoredRecipe } from "@/lib/recommendation/engine";
import { getTopRecommendations } from "@/lib/recommendation/engine";

// ── Static recipe data for demo (Phase 3 replaces this with DB) ──────────────

const DEMO_RECIPES = [
  {
    id: "r1",
    slug: "moong-dal-khichdi",
    name: "Moong Dal Khichdi",
    description:
      "One-pot comfort meal with rice and yellow moong dal, cooked with ghee, cumin, and turmeric.",
    mealTypes: ["LUNCH", "DINNER"],
    cuisineRegion: "NORTH_INDIAN",
    dietaryPatterns: ["VEGETARIAN", "VEGAN"],
    difficultyLevel: "EASY" as const,
    prepTimeMinutes: 5,
    cookTimeMinutes: 20,
    totalTimeMinutes: 25,
    servings: 2,
    costMin: 40,
    costMax: 60,
    tags: ["One-Pot", "High Protein", "Comfort Food"],
    proteinSource: "Moong dal",
    ingredientNames: ["Rice", "Dal", "Onion", "Tomato", "Spices", "Cooking oil"],
    allergenTags: [],
    emoji: "🍲",
    gradient: "from-amber-400 via-yellow-300 to-orange-300",
    nutritionNote:
      "Estimated 280–360 kcal per serving depending on rice quantity, ghee, and portion size.",
    whyItWorks:
      "Dal provides plant-based protein and lysine; rice provides carbohydrates for energy. This combination is nutritionally complementary.",
  },
  {
    id: "r2",
    slug: "poha-peanuts",
    name: "Poha with Peanuts",
    description:
      "Fluffy flattened rice tossed with mustard seeds, curry leaves, onion, peanuts, and turmeric.",
    mealTypes: ["BREAKFAST", "SNACK"],
    cuisineRegion: "MIXED_INDIAN",
    dietaryPatterns: ["VEGETARIAN", "VEGAN"],
    difficultyLevel: "VERY_EASY" as const,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    servings: 1,
    costMin: 30,
    costMax: 45,
    tags: ["Quick", "Breakfast", "Beginner-friendly"],
    proteinSource: "Peanuts",
    ingredientNames: ["Poha", "Peanuts", "Onion", "Spices", "Cooking oil"],
    allergenTags: ["peanuts"],
    emoji: "🥘",
    gradient: "from-yellow-300 via-amber-200 to-lime-200",
    nutritionNote:
      "Estimated 220–290 kcal per serving depending on oil and peanut quantity used.",
    whyItWorks:
      "Poha is a light source of carbohydrates and iron (when using iron-fortified variety). Peanuts add healthy fats and plant protein.",
  },
  {
    id: "r3",
    slug: "besan-chilla",
    name: "Besan Chilla",
    description:
      "Crispy savory pancake made from chickpea flour, onion, green chilli, and coriander.",
    mealTypes: ["BREAKFAST", "SNACK", "LUNCH"],
    cuisineRegion: "NORTH_INDIAN",
    dietaryPatterns: ["VEGETARIAN", "VEGAN"],
    difficultyLevel: "VERY_EASY" as const,
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    totalTimeMinutes: 20,
    servings: 2,
    costMin: 25,
    costMax: 40,
    tags: ["High Protein", "Quick", "Beginner-friendly"],
    proteinSource: "Chickpea flour (besan)",
    ingredientNames: ["Atta", "Onion", "Tomato", "Spices", "Cooking oil", "Coriander"],
    allergenTags: [],
    emoji: "🫓",
    gradient: "from-orange-300 via-amber-300 to-yellow-200",
    nutritionNote:
      "Estimated 180–260 kcal per 2 chillas depending on oil used and filling.",
    whyItWorks:
      "Besan (chickpea flour) is a good source of plant protein and fiber. Chilla is one of the highest-protein quick breakfast options.",
  },
  {
    id: "r4",
    slug: "curd-rice",
    name: "Curd Rice",
    description:
      "Cooked rice mixed with fresh curd, tempered with mustard seeds, curry leaves, and green chilli.",
    mealTypes: ["LUNCH", "DINNER", "SNACK"],
    cuisineRegion: "SOUTH_INDIAN",
    dietaryPatterns: ["VEGETARIAN"],
    difficultyLevel: "VERY_EASY" as const,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    totalTimeMinutes: 5,
    servings: 1,
    costMin: 20,
    costMax: 35,
    tags: ["No-Cook", "Cooling", "Probiotic"],
    proteinSource: "Curd (yogurt)",
    ingredientNames: ["Rice", "Curd", "Spices", "Cooking oil"],
    allergenTags: ["dairy"],
    emoji: "🍚",
    gradient: "from-blue-200 via-sky-100 to-white",
    nutritionNote:
      "Estimated 200–280 kcal per serving. Curd provides probiotics and calcium.",
    whyItWorks:
      "Curd rice is cooling, easy to digest, and provides probiotics from fermented curd. Great when you need something light.",
  },
  {
    id: "r5",
    slug: "egg-bhurji-roti",
    name: "Egg Bhurji with Roti",
    description:
      "Spiced scrambled eggs cooked with onion, tomato, and green chilli served with wheat roti.",
    mealTypes: ["BREAKFAST", "LUNCH", "DINNER"],
    cuisineRegion: "NORTH_INDIAN",
    dietaryPatterns: ["EGGETARIAN"],
    difficultyLevel: "EASY" as const,
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    totalTimeMinutes: 20,
    servings: 1,
    costMin: 45,
    costMax: 65,
    tags: ["High Protein", "Quick", "Filling"],
    proteinSource: "Eggs",
    ingredientNames: ["Eggs", "Atta", "Onion", "Tomato", "Spices", "Cooking oil"],
    allergenTags: ["eggs"],
    emoji: "🍳",
    gradient: "from-yellow-400 via-orange-200 to-amber-100",
    nutritionNote:
      "Estimated 320–420 kcal depending on eggs used and oil quantity.",
    whyItWorks:
      "Eggs provide complete protein with all essential amino acids. Combined with roti for carbohydrates, this is a balanced quick meal.",
  },
  {
    id: "r6",
    slug: "chana-chaat",
    name: "Chana Chaat",
    description:
      "Boiled chickpeas tossed with onion, tomato, chaat masala, lemon, and coriander.",
    mealTypes: ["SNACK", "LUNCH"],
    cuisineRegion: "NORTH_INDIAN",
    dietaryPatterns: ["VEGETARIAN", "VEGAN"],
    difficultyLevel: "VERY_EASY" as const,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    totalTimeMinutes: 10,
    servings: 1,
    costMin: 25,
    costMax: 45,
    tags: ["No-Cook", "High Protein", "Quick"],
    proteinSource: "Chickpeas (chana)",
    ingredientNames: ["Chana", "Onion", "Tomato", "Spices", "Lemon", "Coriander"],
    allergenTags: [],
    emoji: "🥗",
    gradient: "from-amber-300 via-yellow-200 to-lime-100",
    nutritionNote:
      "Estimated 180–240 kcal per serving. Chickpeas are high in fiber and plant protein.",
    whyItWorks:
      "Chickpeas are an excellent plant protein source with high fiber content. Chaat is a tasty no-cooking way to eat legumes.",
  },
];

// ── Recipe Card Component ─────────────────────────────────────────────────────

function RecommendationCard({
  scored,
  index,
}: {
  scored: ScoredRecipe & { recipe: (typeof DEMO_RECIPES)[0] };
  index: number;
}) {
  const { recipe, humanReasons, missingIngredients, suitabilityLabel, totalScore } = scored;

  const rankColors = ["text-brand-turmeric", "text-brand-green", "text-text-muted"];
  const rankBgs = ["bg-status-warning-bg", "bg-status-success-bg", "bg-surface-muted"];

  return (
    <article
      className="card-hover overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
      aria-label={`Recommendation ${index + 1}: ${recipe.name}`}
    >
      {/* Illustration */}
      <div
        className={cn(
          "relative h-40 flex items-center justify-center bg-gradient-to-br",
          recipe.gradient
        )}
      >
        <span className="text-6xl select-none" aria-hidden="true">
          {recipe.emoji}
        </span>

        {/* Rank badge */}
        <div
          className={cn(
            "absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black",
            rankBgs[index],
            rankColors[index]
          )}
          aria-label={`Rank ${index + 1}`}
        >
          {index + 1}
        </div>

        {/* Suitability label */}
        <div className="absolute top-3 right-3 badge bg-white/90 text-text-secondary">
          {suitabilityLabel}
        </div>

        {/* Tags */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {recipe.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="badge bg-white/80 text-text-secondary text-2xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h2 className="font-bold text-lg text-text-primary leading-tight">
            {recipe.name}
          </h2>
          <p className="text-sm text-text-muted mt-1 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs mb-3">
          <span className="flex items-center gap-1.5 text-text-muted font-medium">
            <Clock className="w-3.5 h-3.5 text-brand-green" aria-hidden />
            {recipe.totalTimeMinutes} min
          </span>
          <span className="flex items-center gap-1.5 text-text-muted font-medium">
            <IndianRupee className="w-3.5 h-3.5 text-brand-turmeric" aria-hidden />
            ₹{recipe.costMin}–{recipe.costMax}
          </span>
          <span className="flex items-center gap-1.5 text-text-muted font-medium">
            <ChefHat className="w-3.5 h-3.5 text-brand-green" aria-hidden />
            {recipe.difficultyLevel.replace("_", " ").toLowerCase()}
          </span>
        </div>

        {/* Why suggested */}
        <div className="bg-status-success-bg rounded-xl p-3 mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5 text-brand-green" aria-hidden />
            <p className="text-2xs font-bold text-brand-green uppercase tracking-wide">
              Why suggested
            </p>
          </div>
          <ul className="flex flex-col gap-1">
            {humanReasons.map((reason) => (
              <li key={reason} className="flex items-start gap-1.5">
                <Check className="w-3 h-3 text-brand-green mt-0.5 shrink-0" aria-hidden />
                <span className="text-xs text-text-secondary">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing ingredients */}
        {missingIngredients.length > 0 && (
          <div className="bg-status-warning-bg rounded-xl p-3 mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-status-warning" aria-hidden />
              <p className="text-2xs font-bold text-status-warning uppercase tracking-wide">
                Need to get
              </p>
            </div>
            <p className="text-xs text-text-secondary">
              {missingIngredients.join(", ")}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mb-3">
          <Link
            href={`/recipes/${recipe.slug}`}
            className="btn-primary btn-sm flex-1 text-center"
            id={`view-recipe-${recipe.slug}`}
          >
            View recipe
          </Link>
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/saved", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ recipeId: recipe.id, eventType: "saved" }),
                });
                if (res.ok) {
                  alert("Meal saved to your collection!");
                }
              } catch (e) {
                console.error("Failed to save meal:", e);
              }
            }}
            className="btn-secondary btn-sm px-3"
            aria-label={`Save ${recipe.name}`}
          >
            <Bookmark className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Feedback */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={async () => {
              try {
                await fetch("/api/feedback", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ recipeId: recipe.id, action: "like" }),
                });
                alert("Thanks for your feedback!");
              } catch (e) {
                console.error("Feedback error:", e);
              }
            }}
            className="text-xs text-text-muted hover:text-status-success flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-status-success-bg transition-colors"
            aria-label="I like this suggestion"
          >
            <ThumbsUp className="w-3 h-3" aria-hidden />
            Like this
          </button>
          {["Too expensive", "Too difficult", "Missing ingredients", "Not my taste"].map(
            (reason) => (
              <button
                key={reason}
                onClick={async () => {
                  try {
                    await fetch("/api/feedback", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        recipeId: recipe.id,
                        action: "reject",
                        reason: reason.toLowerCase().replace(/ /g, "_"),
                      }),
                    });
                    alert(`Noted: ${reason}. We'll adjust your suggestions.`);
                  } catch (e) {
                    console.error("Feedback error:", e);
                  }
                }}
                className="text-xs text-text-muted hover:text-status-error flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-status-error-bg transition-colors"
                aria-label={`Feedback: ${reason}`}
              >
                {reason}
              </button>
            )
          )}
        </div>
      </div>
    </article>
  );
}

// ── Results Page ──────────────────────────────────────────────────────────────

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mealType = (searchParams.get("mealType") || "LUNCH") as string;
  const timeLimit = parseInt(searchParams.get("timeLimit") || "30");
  const budget = parseInt(searchParams.get("budget") || "100");
  const effort = (searchParams.get("effort") || "EASY") as "VERY_EASY" | "EASY" | "MODERATE";
  const rawIngredients = searchParams.get("ingredients") || "";
  const pantryIngredients = rawIngredients
    ? rawIngredients.split(",").filter(Boolean)
    : [];

  // Run recommendation engine with demo data
  const userContext = {
    dietaryPattern: "VEGETARIAN",
    allergens: [],
    foodDislikes: [],
    cuisineRegions: ["MIXED_INDIAN"],
    cookingSkill: "BEGINNER" as const,
    budgetMax: budget,
    timeMinutes: timeLimit,
    mealType: mealType as "BREAKFAST" | "LUNCH" | "SNACK" | "DINNER",
    pantryIngredients,
    goals: [],
  };

  const results = getTopRecommendations(DEMO_RECIPES as any, userContext, 3);

  const mealTypeLabels: Record<string, string> = {
    BREAKFAST: "breakfast",
    LUNCH: "lunch",
    SNACK: "snack",
    DINNER: "dinner",
  };

  return (
    <div className="container-app py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-brand-green transition-colors mb-4"
          aria-label="Go back to meal planning form"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Change options
        </button>

        <h1 className="page-title mb-1">
          3 {mealTypeLabels[mealType]} ideas for you
        </h1>
        <p className="text-text-muted text-sm">
          Based on: {timeLimit} min · ₹{budget} budget
          {pantryIngredients.length > 0
            ? ` · ${pantryIngredients.length} pantry items`
            : ""}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4" aria-hidden="true">🤔</div>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            No meals found with these filters
          </h2>
          <p className="text-text-muted text-sm mb-4">
            Try adjusting your time, budget, or ingredient filters to see more
            options.
          </p>
          <button
            onClick={() => router.back()}
            className="btn-primary btn-md"
          >
            Adjust filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {results.map((scored, i) => (
            <RecommendationCard
              key={scored.recipe.id}
              scored={scored as any}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-surface-muted rounded-xl border border-border-muted">
        <p className="text-xs text-text-muted leading-relaxed">
          <strong>Note:</strong> NutriFlow provides general food planning for
          everyday wellness. Nutrition estimates are approximate and vary by
          ingredients, portion size, and cooking method. Not medical advice.{" "}
          <Link href="/disclaimer" className="text-brand-green hover:underline">
            Read our disclaimer
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-app py-8 max-w-3xl">
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-40 rounded-none" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="skeleton h-5 rounded-lg w-2/3" />
                  <div className="skeleton h-4 rounded-lg" />
                  <div className="skeleton h-16 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <RecommendationsContent />
    </Suspense>
  );
}
