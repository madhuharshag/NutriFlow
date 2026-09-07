"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Clock,
  IndianRupee,
  ChefHat,
  Leaf,
  ShoppingBasket,
  Target,
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// ── Static seed data for the landing page preview ──────────────────────────

const previewMeals = [
  {
    id: 1,
    name: "Moong Dal Khichdi",
    description:
      "One-pot comfort meal with rice and yellow moong dal, cooked with ghee and basic spices.",
    time: "25 min",
    cost: "₹40–60",
    difficulty: "Beginner",
    tags: ["Vegetarian", "High Protein", "One-Pot"],
    cuisine: "North Indian",
    matchReasons: [
      "Uses your pantry dal & rice",
      "Under ₹60 budget",
      "25 min, beginner-friendly",
    ],
    gradient: "from-amber-400 via-yellow-300 to-orange-300",
    emoji: "🍲",
    protein: "Moong dal",
  },
  {
    id: 2,
    name: "Poha with Peanuts",
    description:
      "Fluffy flattened rice tossed with mustard seeds, curry leaves, onion, peanuts and turmeric.",
    time: "15 min",
    cost: "₹30–45",
    difficulty: "Beginner",
    tags: ["Vegetarian", "Quick", "Breakfast"],
    cuisine: "Central Indian",
    matchReasons: [
      "Uses your poha & peanuts",
      "Ready in 15 minutes",
      "Very budget-friendly",
    ],
    gradient: "from-yellow-300 via-amber-200 to-lime-200",
    emoji: "🥘",
    protein: "Peanuts",
  },
  {
    id: 3,
    name: "Besan Chilla",
    description:
      "Crispy savory pancake made from chickpea flour, onion, green chilli, and coriander.",
    time: "20 min",
    cost: "₹25–40",
    difficulty: "Beginner",
    tags: ["Vegetarian", "High Protein", "No Cooking Skills"],
    cuisine: "Pan-Indian",
    matchReasons: [
      "Uses your besan & basic veggies",
      "Great protein source",
      "Quick and filling",
    ],
    gradient: "from-orange-300 via-amber-300 to-yellow-200",
    emoji: "🫓",
    protein: "Chickpea flour",
  },
];

const steps = [
  {
    step: "01",
    title: "Tell us your situation",
    description:
      "Your diet, cooking skill, time available, budget, and what's in your pantry right now.",
    icon: Target,
    color: "text-brand-green",
    bg: "bg-status-success-bg",
  },
  {
    step: "02",
    title: "Choose your meal type",
    description:
      "Breakfast, lunch, snack, or dinner — we'll match the right meal to the right moment.",
    icon: Clock,
    color: "text-brand-turmeric",
    bg: "bg-status-warning-bg",
  },
  {
    step: "03",
    title: "Get 3 practical suggestions",
    description:
      "We show you three realistic options with recipes, cost, and why each one works for you.",
    icon: ChefHat,
    color: "text-brand-green",
    bg: "bg-status-success-bg",
  },
];

const benefits = [
  {
    icon: IndianRupee,
    title: "Budget-aware",
    description:
      "Every suggestion fits your budget — whether it's ₹40 or ₹150 a meal.",
    color: "text-brand-green",
    bg: "bg-status-success-bg",
  },
  {
    icon: Leaf,
    title: "Indian-food first",
    description:
      "Dal, chawal, roti, sabzi, chaat — we know Indian kitchens and Indian budgets.",
    color: "text-brand-turmeric",
    bg: "bg-status-warning-bg",
  },
  {
    icon: ShoppingBasket,
    title: "Use what you have",
    description:
      "Tell us your pantry and we'll build meals around what you already have.",
    color: "text-brand-green",
    bg: "bg-status-success-bg",
  },
  {
    icon: ChefHat,
    title: "Beginner-friendly",
    description:
      "Simple steps, household measurements (katori, tablespoon), practical substitutions.",
    color: "text-brand-turmeric",
    bg: "bg-status-warning-bg",
  },
  {
    icon: Zap,
    title: "No calorie counting",
    description:
      "We focus on making better food choices, not obsessing over numbers.",
    color: "text-brand-green",
    bg: "bg-status-success-bg",
  },
  {
    icon: Shield,
    title: "Private and safe",
    description:
      "Your dietary preferences and food habits are sensitive. We treat them that way.",
    color: "text-brand-turmeric",
    bg: "bg-status-warning-bg",
  },
];

const faqs = [
  {
    q: "Do I need to count calories or track macros?",
    a: "No. NutriFlow is not a calorie counter. We help you make better food decisions — pick a practical Indian meal that fits your time, budget, and ingredients — without logging every gram or weighing food.",
  },
  {
    q: "Does NutriFlow work for vegetarians and vegans?",
    a: "Yes. NutriFlow prioritizes vegetarian and vegan Indian meals. You set your dietary preference during onboarding and we will never suggest meals that don't match.",
  },
  {
    q: "Do I need cooking skills to use NutriFlow?",
    a: "Not at all. We have recipes for beginners with zero cooking experience — poha, chilla, curd rice, sprouts chaat — all with simple step-by-step instructions and household measurements.",
  },
  {
    q: "Can I use NutriFlow if I have food allergies?",
    a: "Yes. You can declare allergies and intolerances during onboarding. NutriFlow will filter out meals that contain those ingredients. However, NutriFlow is not a medical system — for severe allergies please consult a healthcare professional.",
  },
  {
    q: "Is NutriFlow free to use?",
    a: "The core meal planning features are free. Start planning your next meal without a credit card.",
  },
  {
    q: "Will NutriFlow give me medical or diet advice?",
    a: "No. NutriFlow provides general food planning and nutrition education for everyday wellness. It is not medical advice. For medical conditions, pregnancy, therapeutic diets, or eating concerns, please consult a qualified healthcare professional.",
  },
];

// ── Components ──────────────────────────────────────────────────────────────

function MealPreviewCard({
  meal,
  index,
}: {
  meal: (typeof previewMeals)[0];
  index: number;
}) {
  return (
    <div
      className="card-hover flex flex-col overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Illustration area */}
      <div
        className={cn(
          "relative h-44 flex items-center justify-center",
          `bg-gradient-to-br ${meal.gradient}`
        )}
        role="img"
        aria-label={`${meal.name} illustration`}
      >
        <span className="text-7xl select-none" aria-hidden="true">
          {meal.emoji}
        </span>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {meal.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="badge bg-white/80 text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-3 right-3 badge bg-white/90 text-text-secondary text-xs">
          {meal.cuisine}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-bold text-text-primary text-lg leading-tight">
            {meal.name}
          </h3>
          <p className="text-sm text-text-muted mt-1 leading-relaxed">
            {meal.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1 text-text-muted font-medium">
            <Clock className="w-3.5 h-3.5 text-brand-green" aria-hidden />
            {meal.time}
          </span>
          <span className="flex items-center gap-1 text-text-muted font-medium">
            <IndianRupee
              className="w-3.5 h-3.5 text-brand-turmeric"
              aria-hidden
            />
            {meal.cost}
          </span>
          <span className="flex items-center gap-1 text-text-muted font-medium">
            <ChefHat className="w-3.5 h-3.5 text-brand-green" aria-hidden />
            {meal.difficulty}
          </span>
        </div>

        {/* Why suggested */}
        <div className="bg-status-success-bg rounded-xl p-3 flex flex-col gap-1.5">
          <p className="text-2xs font-semibold text-brand-green uppercase tracking-wide">
            Why suggested
          </p>
          {meal.matchReasons.map((r) => (
            <div key={r} className="flex items-start gap-1.5">
              <Check
                className="w-3 h-3 text-brand-green mt-0.5 shrink-0"
                aria-hidden
              />
              <span className="text-xs text-text-secondary">{r}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/signup"
          className="btn-primary btn-md w-full mt-auto"
          aria-label={`Plan a meal like ${meal.name}`}
        >
          Plan meals like this
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-muted last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-text-primary group-hover:text-brand-green transition-colors pr-4 text-sm md:text-base">
          {q}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-text-muted shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div className="pb-4 pr-8 animate-fade-in">
          <p className="text-sm text-text-secondary leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Main Landing Page ────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* ── HERO ── */}
        <section
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20"
          aria-labelledby="hero-heading"
        >
          {/* Background decoration */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-green/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-turmeric/8 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-green/3 blur-3xl" />
          </div>

          <div className="container-app relative z-10 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-status-success-bg border border-brand-green/20 px-4 py-2 mb-6 animate-fade-in">
                <Sparkles
                  className="w-4 h-4 text-brand-green"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-brand-green">
                  Practical Indian meal planning · No calorie counting
                </span>
              </div>

              {/* Headline */}
              <h1
                id="hero-heading"
                className="text-balance mb-6 animate-slide-up"
                style={{ animationDelay: "100ms" }}
              >
                Decide your next meal{" "}
                <span className="text-gradient-brand">in under a minute.</span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 text-balance leading-relaxed animate-slide-up"
                style={{ animationDelay: "200ms" }}
              >
                NutriFlow suggests simple Indian meals based on your{" "}
                <strong className="text-text-secondary font-semibold">
                  time
                </strong>
                ,{" "}
                <strong className="text-text-secondary font-semibold">
                  budget
                </strong>
                ,{" "}
                <strong className="text-text-secondary font-semibold">
                  ingredients
                </strong>
                ,{" "}
                <strong className="text-text-secondary font-semibold">
                  dietary preferences
                </strong>
                , and{" "}
                <strong className="text-text-secondary font-semibold">
                  cooking confidence
                </strong>
                —without forcing calorie tracking.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up"
                style={{ animationDelay: "300ms" }}
              >
                <Link
                  href="/signup"
                  className="btn-primary btn-xl w-full sm:w-auto"
                  id="hero-cta-primary"
                >
                  Plan my next meal
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="btn-secondary btn-xl w-full sm:w-auto"
                  id="hero-cta-secondary"
                >
                  See how NutriFlow works
                </Link>
              </div>

              {/* Social proof */}
              <div
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 animate-fade-in"
                style={{ animationDelay: "450ms" }}
              >
                {[
                  "No calorie obsession",
                  "80+ Indian recipes",
                  "Beginner-friendly",
                  "Free to start",
                ].map((proof) => (
                  <div
                    key={proof}
                    className="flex items-center gap-1.5 text-sm text-text-muted"
                  >
                    <Check
                      className="w-4 h-4 text-brand-green"
                      aria-hidden="true"
                    />
                    {proof}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EXAMPLE MEAL CARDS ── */}
        <section
          className="section bg-white"
          aria-labelledby="examples-heading"
        >
          <div className="container-app">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-status-warning-bg border border-brand-turmeric/20 px-4 py-2 mb-4">
                <Star
                  className="w-4 h-4 text-brand-turmeric"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-brand-turmeric">
                  Example suggestions
                </span>
              </div>
              <h2 id="examples-heading" className="mb-3">
                Real meals, real budgets.
              </h2>
              <p className="text-text-muted max-w-xl mx-auto">
                These are the kind of practical, affordable Indian meals
                NutriFlow suggests — with explanations for why each one fits
                your situation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {previewMeals.map((meal, i) => (
                <MealPreviewCard key={meal.id} meal={meal} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          className="section bg-brand-cream"
          id="how-it-works"
          aria-labelledby="how-heading"
        >
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 id="how-heading" className="mb-3">
                How NutriFlow works
              </h2>
              <p className="text-text-muted max-w-xl mx-auto">
                From zero to a practical meal plan in under a minute. No setup
                required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div
                className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-green/30 via-brand-turmeric/30 to-brand-green/30"
                aria-hidden="true"
              />

              {steps.map((step, i) => (
                <div
                  key={step.step}
                  className="relative flex flex-col items-center text-center p-6 animate-fade-in"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-card",
                      step.bg
                    )}
                  >
                    <step.icon
                      className={cn("w-7 h-7", step.color)}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-4xl font-black text-brand-green/10 -mt-2 mb-2 leading-none select-none">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link
                href="/signup"
                className="btn-primary btn-lg"
                id="how-it-works-cta"
              >
                Try it now — it's free
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY DIFFERENT ── */}
        <section
          className="section bg-white"
          id="why-different"
          aria-labelledby="why-heading"
        >
          <div className="container-app">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: text */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-status-success-bg border border-brand-green/20 px-4 py-2 mb-6">
                  <Leaf
                    className="w-4 h-4 text-brand-green"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-brand-green">
                    Different by design
                  </span>
                </div>
                <h2 id="why-heading" className="mb-5">
                  Not another calorie tracker.
                </h2>
                <p className="text-text-muted text-lg mb-6 leading-relaxed">
                  Most nutrition apps are built for obsessive tracking. NutriFlow
                  is built for decision-making — helping you answer the daily
                  question:{" "}
                  <em className="text-text-secondary font-medium">
                    "What should I eat next?"
                  </em>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Other apps */}
                  <div className="card-surface p-4">
                    <p className="text-sm font-bold text-text-muted mb-3 uppercase tracking-wide">
                      Other nutrition apps
                    </p>
                    <ul className="flex flex-col gap-2 text-sm text-text-muted">
                      {[
                        "Log every meal by weight",
                        "Count exact calories",
                        "Scan every barcode",
                        "Complicated dashboards",
                        "Generic Western food db",
                        "Guilt and pressure",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span
                            className="text-status-error mt-0.5"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* NutriFlow */}
                  <div className="card p-4 border-2 border-brand-green/20">
                    <p className="text-sm font-bold text-brand-green mb-3 uppercase tracking-wide">
                      NutriFlow
                    </p>
                    <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                      {[
                        "Decide what to eat next",
                        "Budget-aware suggestions",
                        "Use pantry ingredients",
                        "Simple recipe steps",
                        "Indian-food first",
                        "No guilt, no pressure",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check
                            className="w-4 h-4 text-brand-green mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: quote card */}
              <div className="flex justify-center">
                <div className="card-lg max-w-md p-8 relative overflow-hidden">
                  <div
                    className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-green/5 to-brand-turmeric/5 rounded-full -translate-y-1/2 translate-x-1/2"
                    aria-hidden="true"
                  />
                  <div className="text-5xl mb-4" aria-hidden="true">
                    🤔
                  </div>
                  <p className="text-2xl font-bold text-text-primary mb-4 leading-snug text-balance">
                    "I have rice, dal, onion, and 20 minutes. What should I
                    make?"
                  </p>
                  <p className="text-text-muted text-sm mb-6">
                    This is the everyday question NutriFlow answers — not a
                    macro dashboard.
                  </p>
                  <div className="bg-status-success-bg rounded-xl p-4">
                    <p className="text-sm font-semibold text-brand-green mb-2">
                      NutriFlow suggests:
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl" aria-hidden="true">
                        🍲
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">
                          Moong Dal Khichdi
                        </p>
                        <p className="text-xs text-text-muted">
                          25 min · ₹40–60 · Beginner · Uses all your
                          ingredients
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section
          className="section bg-brand-cream"
          aria-labelledby="benefits-heading"
        >
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 id="benefits-heading" className="mb-3">
                Built for young Indian life
              </h2>
              <p className="text-text-muted max-w-xl mx-auto">
                Hostel rooms, PGs, tight budgets, busy schedules — NutriFlow is
                designed for how you actually eat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((benefit, i) => (
                <div
                  key={benefit.title}
                  className="card-hover p-6 animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center mb-4",
                      benefit.bg
                    )}
                  >
                    <benefit.icon
                      className={cn("w-5 h-5", benefit.color)}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRIVACY / SAFETY ── */}
        <section
          className="section-sm bg-text-primary text-white"
          aria-labelledby="privacy-heading"
        >
          <div className="container-narrow text-center">
            <Shield
              className="w-10 h-10 text-brand-turmeric mx-auto mb-4"
              aria-hidden="true"
            />
            <h2
              id="privacy-heading"
              className="text-white text-2xl md:text-3xl mb-4"
            >
              Your food habits are private.
            </h2>
            <p className="text-white/70 text-base mb-5 leading-relaxed">
              Dietary preferences, allergies, and food choices are sensitive
              information. NutriFlow collects only what's needed to help you
              plan meals — never to sell or advertise to you.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                "No ads using food data",
                "No selling personal data",
                "Export your data anytime",
                "Delete account on request",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-white/70"
                >
                  <Check
                    className="w-4 h-4 text-brand-turmeric"
                    aria-hidden="true"
                  />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/privacy-policy"
                className="text-sm text-brand-turmeric hover:text-brand-turmeric-light transition-colors underline underline-offset-4"
              >
                Read our Privacy Policy →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section bg-white" aria-labelledby="faq-heading">
          <div className="container-narrow">
            <div className="text-center mb-10">
              <h2 id="faq-heading" className="mb-3">
                Common questions
              </h2>
              <p className="text-text-muted">
                Honest answers about what NutriFlow is and isn't.
              </p>
            </div>

            <div className="card p-2 md:p-4">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section
          className="section bg-gradient-brand text-white"
          aria-labelledby="final-cta-heading"
        >
          <div className="container-narrow text-center">
            <div className="text-5xl mb-6" aria-hidden="true">
              🍱
            </div>
            <h2
              id="final-cta-heading"
              className="text-white text-3xl md:text-4xl mb-4"
            >
              What's your next meal?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Stop wondering, start eating well. Let NutriFlow find a practical
              Indian meal that fits your life.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-brand-green font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/95 transition-all active:scale-[0.98]"
              id="final-cta"
            >
              Plan my next meal — it's free
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <p className="text-white/50 text-sm mt-4">
              No credit card. No calorie counting. No guilt.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
