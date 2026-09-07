"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 9;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [diet, setDiet] = useState<string>("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [skill, setSkill] = useState<string>("");
  const [budget, setBudget] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [pantry, setPantry] = useState<string[]>([]);
  
  const [searchDislikes, setSearchDislikes] = useState("");
  const [searchPantry, setSearchPantry] = useState("");

  const commonIngredients = [
    "Rice", "Atta", "Dal", "Oats", "Poha", "Bread", "Eggs", "Milk",
    "Curd", "Paneer", "Tofu", "Onion", "Tomato", "Potato",
    "Peanuts", "Chana", "Spices", "Cooking oil"
  ];

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else handleComplete();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const payload = {
        dietaryPattern: diet || "VEGETARIAN",
        allergens: allergies,
        foodDislikes: dislikes,
        cuisineRegions: cuisine.length > 0 ? cuisine : ["PAN_INDIAN"],
        cookingSkill: skill || "BEGINNER",
        budgetMin: 30,
        budgetMax: budget || 150,
        timeMinutes: time || 30,
        goals,
        pantryIngredients: pantry,
      };

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn("Failed to persist onboarding remotely, continuing to home");
      }
    } catch (err) {
      console.error("Error saving onboarding preferences:", err);
    } finally {
      setLoading(false);
      router.push("/home");
    }
  };

  const toggleArrayItem = (item: string, state: string[], setState: (arr: string[]) => void) => {
    setState(state.includes(item) ? state.filter((i) => i !== item) : [...state, item]);
  };

  return (
    <div className="container-app py-8 max-w-xl mx-auto flex flex-col min-h-[80vh]">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-text-muted mb-2">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} 
          />
        </div>
      </div>

      {/* Steps Content */}
      <div className="flex-1">
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">What is your primary diet?</h1>
            <p className="text-text-muted mb-6">We'll filter out meals that don't fit.</p>
            <div className="flex flex-col gap-3">
              {[
                { id: "VEGETARIAN", label: "Vegetarian", desc: "No meat, poultry, or seafood" },
                { id: "EGGETARIAN", label: "Eggetarian", desc: "Vegetarian + eggs" },
                { id: "NON_VEGETARIAN", label: "Non-vegetarian", desc: "Includes meat, poultry, seafood" },
                { id: "VEGAN", label: "Vegan", desc: "No animal products (dairy, eggs, honey)" },
                { id: "JAIN_FRIENDLY", label: "Jain-friendly", desc: "No root vegetables" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDiet(opt.id)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
                    diet === opt.id ? "border-brand-green bg-status-success-bg" : "border-border bg-white hover:border-brand-green/30"
                  )}
                >
                  <span className={cn("font-semibold mb-1", diet === opt.id ? "text-brand-green" : "text-text-primary")}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-text-muted">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">Any allergies?</h1>
            <p className="text-text-muted mb-6">Select any ingredients you need to avoid.</p>
            <div className="flex flex-wrap gap-2">
              {["Dairy", "Gluten", "Peanuts", "Tree nuts", "Soy", "Eggs", "Shellfish"].map(item => (
                <button
                  key={item}
                  onClick={() => toggleArrayItem(item, allergies, setAllergies)}
                  className={cn(
                    "chip", 
                    allergies.includes(item) && "chip-selected"
                  )}
                >
                  {allergies.includes(item) && <Check className="w-3 h-3" />}
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">Any ingredients you dislike?</h1>
            <p className="text-text-muted mb-6">We won't suggest meals where these are main ingredients.</p>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchDislikes}
                onChange={(e) => setSearchDislikes(e.target.value)}
                placeholder="Search ingredients..."
                className="input pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {commonIngredients
                .filter(i => i.toLowerCase().includes(searchDislikes.toLowerCase()))
                .slice(0, 10)
                .map(item => (
                <button
                  key={item}
                  onClick={() => toggleArrayItem(item, dislikes, setDislikes)}
                  className={cn("chip", dislikes.includes(item) && "chip-selected")}
                >
                  {dislikes.includes(item) && <Check className="w-3 h-3" />}
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">What kind of food do you prefer?</h1>
            <p className="text-text-muted mb-6">Select the regional cuisines you enjoy most.</p>
            <div className="flex flex-col gap-3">
              {[
                { id: "NORTH_INDIAN", label: "North Indian" },
                { id: "SOUTH_INDIAN", label: "South Indian" },
                { id: "EAST_INDIAN", label: "East Indian" },
                { id: "WEST_INDIAN", label: "West Indian" },
                { id: "MIXED_INDIAN", label: "Mixed Indian" },
                { id: "ANY", label: "Open to anything" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleArrayItem(opt.id, cuisine, setCuisine)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all",
                    cuisine.includes(opt.id) ? "border-brand-green bg-status-success-bg" : "border-border bg-white hover:border-brand-green/30"
                  )}
                >
                  <span className={cn("font-semibold", cuisine.includes(opt.id) ? "text-brand-green" : "text-text-primary")}>
                    {opt.label}
                  </span>
                  {cuisine.includes(opt.id) && <Check className="w-5 h-5 text-brand-green" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">How confident are you in the kitchen?</h1>
            <p className="text-text-muted mb-6">This helps us suggest recipes with the right difficulty.</p>
            <div className="flex flex-col gap-3">
              {[
                { id: "BEGINNER", label: "Beginner", desc: "I can boil water and make instant noodles." },
                { id: "COMFORTABLE", label: "Comfortable", desc: "I can follow simple recipes and make basic meals." },
                { id: "CONFIDENT", label: "Confident", desc: "I cook often and feel comfortable trying new things." }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSkill(opt.id)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
                    skill === opt.id ? "border-brand-green bg-status-success-bg" : "border-border bg-white hover:border-brand-green/30"
                  )}
                >
                  <span className={cn("font-semibold mb-1", skill === opt.id ? "text-brand-green" : "text-text-primary")}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-text-muted">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">What's your typical budget per meal?</h1>
            <p className="text-text-muted mb-6">We'll prioritize meals that fit this limit.</p>
            <div className="flex flex-col gap-3">
              {[
                { value: 50, label: "Under ₹50 (Very tight)" },
                { value: 100, label: "₹50 - ₹100 (Budget friendly)" },
                { value: 150, label: "₹100 - ₹150 (Comfortable)" },
                { value: 999, label: "₹150+ (Flexible)" }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setBudget(opt.value)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all",
                    budget === opt.value ? "border-brand-green bg-status-success-bg" : "border-border bg-white hover:border-brand-green/30"
                  )}
                >
                  <span className={cn("font-semibold", budget === opt.value ? "text-brand-green" : "text-text-primary")}>
                    {opt.label}
                  </span>
                  {budget === opt.value && <Check className="w-5 h-5 text-brand-green" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">How much time can you usually spend cooking?</h1>
            <p className="text-text-muted mb-6">We'll focus on recipes that fit your schedule.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 10, label: "Under 10 mins" },
                { value: 20, label: "10-20 mins" },
                { value: 30, label: "20-30 mins" },
                { value: 45, label: "30-45 mins" },
                { value: 60, label: "45+ mins" }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTime(opt.value)}
                  className={cn(
                    "flex items-center justify-center p-4 rounded-xl border-2 text-center transition-all",
                    time === opt.value ? "border-brand-green bg-status-success-bg" : "border-border bg-white hover:border-brand-green/30"
                  )}
                >
                  <span className={cn("font-semibold", time === opt.value ? "text-brand-green" : "text-text-primary")}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">What's your main goal?</h1>
            <p className="text-text-muted mb-6">Select a few things you want to achieve.</p>
            <div className="flex flex-col gap-3">
              {[
                { id: "EAT_REGULARLY", label: "Eat more regularly" },
                { id: "EAT_BALANCED", label: "Eat more balanced meals" },
                { id: "SAVE_MONEY", label: "Save money" },
                { id: "REDUCE_ORDERING", label: "Reduce ordering out" },
                { id: "IMPROVE_ENERGY", label: "Improve energy" },
                { id: "COOK_MORE", label: "Cook more at home" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleArrayItem(opt.id, goals, setGoals)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all",
                    goals.includes(opt.id) ? "border-brand-green bg-status-success-bg" : "border-border bg-white hover:border-brand-green/30"
                  )}
                >
                  <span className={cn("font-semibold", goals.includes(opt.id) ? "text-brand-green" : "text-text-primary")}>
                    {opt.label}
                  </span>
                  {goals.includes(opt.id) && <Check className="w-5 h-5 text-brand-green" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">What's in your pantry right now?</h1>
            <p className="text-text-muted mb-6">Select a few common items to start with.</p>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchPantry}
                onChange={(e) => setSearchPantry(e.target.value)}
                placeholder="Search ingredients..."
                className="input pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {commonIngredients
                .filter(i => i.toLowerCase().includes(searchPantry.toLowerCase()))
                .map(item => (
                <button
                  key={item}
                  onClick={() => toggleArrayItem(item, pantry, setPantry)}
                  className={cn("chip", pantry.includes(item) && "chip-selected")}
                >
                  {pantry.includes(item) && <Check className="w-3 h-3" />}
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-border-muted">
        <button
          onClick={handleBack}
          disabled={step === 1 || loading}
          className="btn-ghost btn-md flex gap-2 items-center"
        >
          {step > 1 && <ArrowLeft className="w-4 h-4" />}
          {step > 1 ? "Back" : ""}
        </button>
        
        <button
          onClick={handleNext}
          disabled={
            (step === 1 && !diet) || 
            (step === 4 && cuisine.length === 0) || 
            (step === 5 && !skill) || 
            (step === 6 && !budget) || 
            (step === 7 && !time) ||
            loading
          }
          className="btn-primary btn-md flex gap-2 items-center min-w-[120px] justify-center"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {step === TOTAL_STEPS ? "Finish" : "Next"}
              {step < TOTAL_STEPS && <ArrowRight className="w-4 h-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
