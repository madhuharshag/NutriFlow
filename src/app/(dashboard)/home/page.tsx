import Link from "next/link";
import {
  Utensils,
  ShoppingBasket,
  BookmarkCheck,
  ShoppingCart,
  Sparkles,
  Clock,
  Leaf,
} from "lucide-react";

const quickStats = [
  {
    icon: Utensils,
    label: "Plan a meal",
    href: "/plan",
    desc: "Get 3 smart suggestions",
    color: "text-brand-green",
    bg: "bg-status-success-bg",
  },
  {
    icon: ShoppingBasket,
    label: "My pantry",
    href: "/pantry",
    desc: "Update what you have",
    color: "text-brand-turmeric",
    bg: "bg-status-warning-bg",
  },
  {
    icon: BookmarkCheck,
    label: "Saved meals",
    href: "/saved",
    desc: "Your recipe collection",
    color: "text-brand-green",
    bg: "bg-status-success-bg",
  },
  {
    icon: ShoppingCart,
    label: "Grocery list",
    href: "/grocery-list",
    desc: "What to buy next",
    color: "text-brand-turmeric",
    bg: "bg-status-warning-bg",
  },
];

const habitNudges = [
  "Have you included a protein source in your last meal?",
  "A fruit or vegetable can make your next meal more balanced.",
  "Dal, eggs, paneer, or peanuts are all great protein options.",
  "Drinking water between meals can help you feel more energetic.",
  "Home-cooked meals are usually more budget-friendly than ordering out.",
];

export default function HomePage() {
  const now = new Date();
  const hour = now.getHours();
  const mealTime =
    hour < 10
      ? "Breakfast"
      : hour < 13
        ? "Lunch"
        : hour < 17
          ? "Snack"
          : "Dinner";

  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const nudge = habitNudges[now.getDate() % habitNudges.length];

  return (
    <div className="container-app py-8 md:py-10 max-w-3xl">
      {/* Greeting */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-5 h-5 text-brand-green" aria-hidden="true" />
          <p className="text-sm font-medium text-brand-green">NutriFlow</p>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
          {greeting} 👋
        </h1>
        <p className="text-text-muted">
          What works for your{" "}
          <strong className="text-text-secondary">{mealTime.toLowerCase()}</strong>?
        </p>
      </div>

      {/* Primary CTA */}
      <Link
        href="/plan"
        className="block card-hover p-6 mb-6 bg-gradient-brand text-white rounded-2xl group relative overflow-hidden"
        id="plan-next-meal-btn"
      >
        <div
          className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-brand-turmeric" aria-hidden />
              <span className="text-sm font-medium text-white/80">
                {mealTime} time
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Plan my next meal
            </h2>
            <p className="text-sm text-white/70">
              Get 3 practical suggestions in under a minute
            </p>
          </div>
          <div
            className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Utensils className="w-6 h-6 text-white" />
          </div>
        </div>
      </Link>

      {/* Habit nudge */}
      <div
        className="flex items-start gap-3 bg-status-warning-bg border border-brand-turmeric/20 rounded-xl p-4 mb-6"
        role="note"
        aria-label="Gentle nutrition reminder"
      >
        <Sparkles
          className="w-4 h-4 text-brand-turmeric shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-sm text-text-secondary leading-relaxed">{nudge}</p>
      </div>

      {/* Quick access cards */}
      <div className="mb-6">
        <h2 className="section-title text-lg mb-4">Quick access</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat) => (
            <Link
              key={stat.href}
              href={stat.href}
              className="card-hover p-4 flex flex-col gap-2"
              id={`quick-${stat.label.toLowerCase().replace(/ /g, "-")}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}
              >
                <stat.icon
                  className={`w-5 h-5 ${stat.color}`}
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  {stat.label}
                </p>
                <p className="text-xs text-text-muted">{stat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Meal time indicator */}
      <div className="card p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-status-info-bg flex items-center justify-center">
          <Clock
            className="w-5 h-5 text-status-info"
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">
            It's {mealTime.toLowerCase()} time
          </p>
          <p className="text-xs text-text-muted">
            {mealTime === "Breakfast"
              ? "Start your day with something energising."
              : mealTime === "Lunch"
                ? "A balanced lunch keeps energy stable through the afternoon."
                : mealTime === "Snack"
                  ? "A small, practical snack can bridge the gap until dinner."
                  : "A filling dinner helps you avoid late-night snacking."}
          </p>
        </div>
      </div>
    </div>
  );
}
