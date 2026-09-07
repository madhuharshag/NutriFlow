import Link from "next/link";
import {
  Clock,
  IndianRupee,
  ChefHat,
  Users,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ShoppingCart,
  Info,
  AlertTriangle,
} from "lucide-react";

// ── Demo recipe data (Phase 3 replaces with DB lookup) ────────────────────────

const recipeData: Record<string, any> = {
  "moong-dal-khichdi": {
    name: "Moong Dal Khichdi",
    description:
      "One-pot comfort meal with rice and yellow moong dal, cooked with ghee, cumin, and turmeric. A staple across Indian households — quick, nutritious, and beginner-friendly.",
    mealTypes: ["Lunch", "Dinner"],
    cuisineRegion: "North Indian",
    dietaryLabels: ["Vegetarian", "Vegan"],
    difficultyLevel: "Easy",
    prepTimeMinutes: 5,
    cookTimeMinutes: 20,
    totalTimeMinutes: 25,
    servings: 2,
    costMin: 40,
    costMax: 60,
    emoji: "🍲",
    gradient: "from-amber-400 via-yellow-300 to-orange-300",
    proteinSource: "Moong dal",
    nutritionNote:
      "Estimated energy: around 280–360 kcal per serving depending on ghee amount, rice quantity, and portion size. Actual values vary significantly by cooking method and ingredient brands. These are estimates, not precise measurements.",
    whyItWorks:
      "Dal provides plant-based protein and the amino acid lysine. Rice provides carbohydrates for energy. These two together create a nutritionally complementary combination. Turmeric contains curcumin, a compound studied for its properties — though NutriFlow makes no therapeutic claims.",
    ingredients: [
      { name: "Rice", quantity: "½", unit: "katori (cup)", notes: "washed" },
      { name: "Moong dal (split yellow)", quantity: "¼", unit: "katori", notes: "washed" },
      { name: "Onion", quantity: "1 small", unit: "", notes: "finely chopped" },
      { name: "Tomato", quantity: "1 small", unit: "", notes: "chopped" },
      { name: "Ginger", quantity: "½ inch", unit: "", notes: "grated (optional)" },
      { name: "Turmeric", quantity: "¼", unit: "teaspoon" },
      { name: "Cumin seeds", quantity: "½", unit: "teaspoon" },
      { name: "Salt", quantity: "", unit: "to taste" },
      { name: "Cooking oil or ghee", quantity: "1", unit: "teaspoon" },
      { name: "Water", quantity: "2½", unit: "katoris" },
    ],
    steps: [
      {
        step: 1,
        instruction:
          "Wash rice and dal together. Add to a pressure cooker or pot with water.",
        tip: "For a softer khichdi, use 2.5–3 cups of water.",
      },
      {
        step: 2,
        instruction:
          "Add turmeric and salt. Cook in a pressure cooker for 2 whistles (or in a pot on medium heat for 20 minutes until dal is soft).",
      },
      {
        step: 3,
        instruction:
          "Heat oil in a small pan. Add cumin seeds and let them splutter. Add onion and cook until golden (3–4 minutes).",
      },
      {
        step: 4,
        instruction:
          "Add tomato and cook for 2 minutes until soft. Add ginger if using.",
      },
      {
        step: 5,
        instruction:
          "Pour this tempering (tadka) over the cooked khichdi. Mix gently and serve hot.",
        tip: "Add a small spoon of ghee on top before serving for extra flavour.",
      },
    ],
    substitutions: [
      {
        original: "Moong dal",
        substitute: "Masoor dal or chana dal",
        note: "Masoor dal cooks slightly faster; chana dal will need longer",
      },
      {
        original: "Rice",
        substitute: "Dalia (broken wheat)",
        note: "Use same quantity; cook time is similar",
      },
      {
        original: "Ghee",
        substitute: "Cooking oil",
        note: "Neutral oil works fine; ghee adds a richer flavour",
      },
    ],
  },
  "poha-peanuts": {
    name: "Poha with Peanuts",
    description:
      "Fluffy flattened rice tossed with mustard seeds, curry leaves, turmeric, and crunchy peanuts. A quick breakfast that's filling and budget-friendly.",
    mealTypes: ["Breakfast", "Snack"],
    cuisineRegion: "Central Indian / Pan-Indian",
    dietaryLabels: ["Vegetarian", "Vegan"],
    difficultyLevel: "Very Easy",
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    servings: 1,
    costMin: 30,
    costMax: 45,
    emoji: "🥘",
    gradient: "from-yellow-300 via-amber-200 to-lime-200",
    proteinSource: "Peanuts",
    nutritionNote:
      "Estimated energy: around 220–290 kcal depending on oil and peanut quantity used. Poha is a source of carbohydrates and a moderate source of iron when made from iron-fortified varieties.",
    whyItWorks:
      "Poha is easy to digest and provides quick energy from carbohydrates. Peanuts add plant protein and healthy unsaturated fats, making this a more balanced meal than plain poha.",
    ingredients: [
      { name: "Poha (thick variety)", quantity: "1", unit: "katori", notes: "rinsed and drained" },
      { name: "Peanuts", quantity: "2", unit: "tablespoons" },
      { name: "Onion", quantity: "½ small", unit: "", notes: "finely chopped" },
      { name: "Green chilli", quantity: "1", unit: "", notes: "sliced (adjust to taste)" },
      { name: "Mustard seeds", quantity: "½", unit: "teaspoon" },
      { name: "Curry leaves", quantity: "5–6", unit: "leaves" },
      { name: "Turmeric", quantity: "¼", unit: "teaspoon" },
      { name: "Salt", quantity: "", unit: "to taste" },
      { name: "Cooking oil", quantity: "1", unit: "teaspoon" },
      { name: "Lemon juice", quantity: "½", unit: "teaspoon", notes: "optional" },
      { name: "Fresh coriander", quantity: "handful", unit: "", notes: "for garnish" },
    ],
    steps: [
      {
        step: 1,
        instruction:
          "Rinse poha in a strainer under water for 30 seconds. Let it drain completely — it should be soft but not mushy.",
        tip: "Don't soak poha in a bowl — it gets too wet. Just rinse and drain.",
      },
      {
        step: 2,
        instruction:
          "Heat oil in a pan on medium heat. Add peanuts and roast for 2 minutes until they start browning. Remove and set aside.",
      },
      {
        step: 3,
        instruction:
          "In the same pan, add mustard seeds and let them splutter. Add curry leaves, green chilli, and onion.",
      },
      {
        step: 4,
        instruction:
          "Cook onion for 3 minutes until it softens. Add turmeric and salt and stir.",
      },
      {
        step: 5,
        instruction:
          "Add the drained poha and roasted peanuts. Mix gently. Cook on low heat for 1–2 minutes.",
        tip: "Don't stir aggressively — poha breaks easily.",
      },
      {
        step: 6,
        instruction:
          "Turn off heat. Add lemon juice and fresh coriander. Serve immediately.",
      },
    ],
    substitutions: [
      {
        original: "Peanuts",
        substitute: "Roasted chana dal or cashews",
        note: "Roasted chana dal is more budget-friendly",
      },
      {
        original: "Curry leaves",
        substitute: "Skip or use dried methi",
        note: "Curry leaves add flavour but can be skipped",
      },
    ],
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = recipeData[slug];

  if (!recipe) {
    return (
      <div className="container-app py-8 max-w-2xl text-center">
        <div className="text-6xl mb-4" aria-hidden="true">🍽️</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Recipe not found
        </h1>
        <p className="text-text-muted mb-6">
          This recipe doesn't exist or has been removed.
        </p>
        <Link href="/recommendations" className="btn-primary btn-md">
          Find other meals
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8 max-w-2xl">
      {/* Back */}
      <Link
        href="/recommendations"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-brand-green transition-colors mb-6"
        aria-label="Back to recommendations"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to suggestions
      </Link>

      {/* Hero illustration */}
      <div
        className={`relative h-52 rounded-2xl flex items-center justify-center bg-gradient-to-br ${recipe.gradient} mb-6 overflow-hidden`}
        role="img"
        aria-label={`${recipe.name} illustration`}
      >
        <span className="text-8xl" aria-hidden="true">{recipe.emoji}</span>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {recipe.dietaryLabels.map((label: string) => (
            <span key={label} className="badge bg-white/90 text-text-secondary">
              {label}
            </span>
          ))}
        </div>
        <div className="absolute top-3 right-3 badge bg-white/90 text-text-secondary">
          {recipe.cuisineRegion}
        </div>
      </div>

      {/* Title & meta */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {recipe.mealTypes.map((t: string) => (
            <span key={t} className="badge-green">{t}</span>
          ))}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          {recipe.name}
        </h1>
        <p className="text-text-muted leading-relaxed">{recipe.description}</p>
      </div>

      {/* Stats bar */}
      <div className="card p-4 grid grid-cols-4 gap-2 text-center mb-6">
        {[
          { icon: Clock, label: "Prep", value: `${recipe.prepTimeMinutes} min`, color: "text-brand-green" },
          { icon: Clock, label: "Cook", value: `${recipe.cookTimeMinutes} min`, color: "text-brand-green" },
          { icon: IndianRupee, label: "Est. cost", value: `₹${recipe.costMin}–${recipe.costMax}`, color: "text-brand-turmeric" },
          { icon: Users, label: "Serves", value: recipe.servings, color: "text-text-muted" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <stat.icon className={`w-4 h-4 ${stat.color}`} aria-hidden="true" />
            <p className="text-xs text-text-muted">{stat.label}</p>
            <p className="text-sm font-bold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-8">
        <button className="btn-primary btn-md flex-1 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" aria-hidden />
          Mark as cooked
        </button>
        <button className="btn-secondary btn-md flex items-center gap-2">
          <Bookmark className="w-4 h-4" aria-hidden />
          Save
        </button>
        <button className="btn-ghost btn-md flex items-center gap-2 border border-border rounded-xl">
          <ShoppingCart className="w-4 h-4" aria-hidden />
          Add to grocery list
        </button>
      </div>

      {/* Why this meal works */}
      <section className="mb-6" aria-labelledby="why-heading">
        <div className="card p-5 bg-status-success-bg border-brand-green/20">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-brand-green" aria-hidden />
            <h2 id="why-heading" className="font-bold text-brand-green text-sm uppercase tracking-wide">
              Why this meal works
            </h2>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {recipe.whyItWorks}
          </p>
          {recipe.proteinSource && (
            <div className="mt-2 text-xs text-brand-green font-medium">
              Protein source: {recipe.proteinSource}
            </div>
          )}
        </div>
      </section>

      {/* Ingredients */}
      <section className="mb-6" aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading" className="section-title text-lg mb-3">
          Ingredients
        </h2>
        <div className="card overflow-hidden">
          <ul role="list">
            {recipe.ingredients.map((ing: any, i: number) => (
              <li
                key={i}
                className="flex items-start gap-3 px-5 py-3 border-b border-border-muted last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-brand-green mt-2 shrink-0" aria-hidden />
                <div className="flex-1">
                  <span className="font-medium text-text-primary text-sm">
                    {ing.name}
                  </span>
                  {(ing.quantity || ing.unit) && (
                    <span className="text-text-muted text-sm">
                      {" "}— {ing.quantity} {ing.unit}
                    </span>
                  )}
                  {ing.notes && (
                    <span className="text-text-placeholder text-xs"> ({ing.notes})</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Substitutions */}
      {recipe.substitutions?.length > 0 && (
        <section className="mb-6" aria-labelledby="subs-heading">
          <h2 id="subs-heading" className="section-title text-lg mb-3">
            Substitutions
          </h2>
          <div className="flex flex-col gap-2">
            {recipe.substitutions.map((sub: any, i: number) => (
              <div key={i} className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-text-primary">
                    {sub.original}
                  </span>
                  <span className="text-text-muted text-xs">→</span>
                  <span className="text-sm font-semibold text-brand-green">
                    {sub.substitute}
                  </span>
                </div>
                {sub.note && (
                  <p className="text-xs text-text-muted">{sub.note}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Steps */}
      <section className="mb-6" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="section-title text-lg mb-3">
          How to make it
        </h2>
        <ol className="flex flex-col gap-3" role="list">
          {recipe.steps.map((step: any) => (
            <li key={step.step} className="card p-4 flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-green text-white text-sm font-bold flex items-center justify-center shrink-0">
                {step.step}
              </div>
              <div>
                <p className="text-sm text-text-primary leading-relaxed">
                  {step.instruction}
                </p>
                {step.tip && (
                  <p className="text-xs text-brand-green mt-1.5 font-medium">
                    💡 {step.tip}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Nutrition estimate */}
      <section className="mb-6" aria-labelledby="nutrition-heading">
        <h2 id="nutrition-heading" className="section-title text-lg mb-3">
          Nutrition estimate
        </h2>
        <div className="card p-5">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-status-warning shrink-0 mt-0.5" aria-hidden />
            <p className="text-xs text-text-muted leading-relaxed">
              <strong className="text-text-secondary">Important:</strong>{" "}
              {recipe.nutritionNote}
            </p>
          </div>
          <p className="text-xs text-text-placeholder leading-relaxed">
            NutriFlow does not provide precise calorie counts for home-cooked
            meals. All values shown are general education estimates based on
            standard ingredient databases and vary significantly with your
            specific ingredients, oil, portions, and cooking method.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="p-4 bg-surface-muted rounded-xl border border-border-muted">
        <p className="text-xs text-text-muted leading-relaxed">
          NutriFlow provides general food planning and nutrition education for
          everyday wellness. This is not medical advice, diagnosis, or
          treatment. Consult a qualified healthcare professional for medical
          conditions, therapeutic diets, or serious allergies.{" "}
          <Link href="/disclaimer" className="text-brand-green hover:underline">
            Read our disclaimer
          </Link>
        </p>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(recipeData).map((slug) => ({ slug }));
}
