import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Seed Content Source
  const defaultSource = await prisma.contentSource.upsert({
    where: { id: "default-system-source" },
    update: {
      name: "NutriFlow Core Kitchen",
      version: "1.0",
      licenseNote: "IFCT 2017 derived estimates",
    },
    create: {
      id: "default-system-source",
      name: "NutriFlow Core Kitchen",
      version: "1.0",
      licenseNote: "IFCT 2017 derived estimates",
    },
  });

  console.log(`Created default content source: ${defaultSource.name}`);

  // 2. Seed basic nutrients
  const nutrients = [
    { name: "energy_kcal", displayName: "Energy (kcal)", unit: "kcal" },
    { name: "protein_g", displayName: "Protein", unit: "g" },
    { name: "carbs_g", displayName: "Carbohydrates", unit: "g" },
    { name: "fat_g", displayName: "Fat", unit: "g" },
    { name: "fiber_g", displayName: "Dietary Fiber", unit: "g" },
  ];

  for (const n of nutrients) {
    await prisma.nutrientDefinition.upsert({
      where: { name: n.name },
      update: { displayName: n.displayName, unit: n.unit },
      create: {
        name: n.name,
        displayName: n.displayName,
        unit: n.unit,
        sourceId: defaultSource.id,
      },
    });
  }

  // 3. Seed core ingredients
  const ingredientsData = [
    { name: "Rice", category: "GRAIN", isAllergen: false, allergenTags: [] },
    { name: "Moong Dal", category: "PULSE", isAllergen: false, allergenTags: [] },
    { name: "Toor Dal", category: "PULSE", isAllergen: false, allergenTags: [] },
    { name: "Chana Dal", category: "PULSE", isAllergen: false, allergenTags: [] },
    { name: "Urad Dal", category: "PULSE", isAllergen: false, allergenTags: [] },
    { name: "Poha", category: "GRAIN", isAllergen: false, allergenTags: [] },
    { name: "Atta (Whole Wheat Flour)", category: "GRAIN", isAllergen: true, allergenTags: ["gluten"] },
    { name: "Besan (Gram Flour)", category: "PULSE", isAllergen: false, allergenTags: [] },
    { name: "Onion", category: "VEGETABLE", isAllergen: false, allergenTags: [] },
    { name: "Tomato", category: "VEGETABLE", isAllergen: false, allergenTags: [] },
    { name: "Potato", category: "VEGETABLE", isAllergen: false, allergenTags: [] },
    { name: "Ginger", category: "HERB", isAllergen: false, allergenTags: [] },
    { name: "Garlic", category: "HERB", isAllergen: false, allergenTags: [] },
    { name: "Green Chilli", category: "VEGETABLE", isAllergen: false, allergenTags: [] },
    { name: "Curry Leaves", category: "HERB", isAllergen: false, allergenTags: [] },
    { name: "Coriander Leaves", category: "HERB", isAllergen: false, allergenTags: [] },
    { name: "Turmeric Powder", category: "SPICE", isAllergen: false, allergenTags: [] },
    { name: "Cumin Seeds", category: "SPICE", isAllergen: false, allergenTags: [] },
    { name: "Mustard Seeds", category: "SPICE", isAllergen: false, allergenTags: [] },
    { name: "Cooking Oil", category: "OIL", isAllergen: false, allergenTags: [] },
    { name: "Ghee", category: "DAIRY", isAllergen: true, allergenTags: ["dairy"] },
    { name: "Peanuts", category: "NUT_SEED", isAllergen: true, allergenTags: ["peanuts"] },
    { name: "Paneer", category: "DAIRY", isAllergen: true, allergenTags: ["dairy"] },
    { name: "Curd (Yogurt)", category: "DAIRY", isAllergen: true, allergenTags: ["dairy"] },
    { name: "Salt", category: "CONDIMENT", isAllergen: false, allergenTags: [] },
  ];

  const ingredientMap = new Map<string, string>();

  for (const ing of ingredientsData) {
    const created = await prisma.ingredient.upsert({
      where: { name: ing.name },
      update: {
        category: ing.category as any,
        isAllergen: ing.isAllergen,
        allergenTags: ing.allergenTags,
      },
      create: {
        name: ing.name,
        category: ing.category as any,
        isAllergen: ing.isAllergen,
        allergenTags: ing.allergenTags,
      },
    });
    ingredientMap.set(ing.name, created.id);
  }

  console.log(`Seeded ${ingredientsData.length} core ingredients`);

  // 4. Seed Khichdi Recipe
  const khichdi = await prisma.recipe.upsert({
    where: { slug: "moong-dal-khichdi" },
    update: {
      name: "Moong Dal Khichdi",
      description: "One-pot comfort meal with rice and yellow moong dal, cooked with ghee, cumin, and turmeric.",
      mealTypes: ["LUNCH", "DINNER"],
      cuisineRegion: "NORTH_INDIAN",
      dietaryPatterns: ["VEGETARIAN", "VEGAN"],
      difficultyLevel: "EASY",
      prepTimeMinutes: 5,
      cookTimeMinutes: 20,
      totalTimeMinutes: 25,
      servings: 2,
      costMin: 40,
      costMax: 60,
      tags: ["One-Pot", "High Protein", "Comfort Food"],
      proteinSource: "Moong dal",
      nutritionNote: "Estimated 280–360 kcal per serving depending on rice quantity, ghee, and portion size.",
      whyItWorks: "Dal provides plant-based protein and lysine; rice provides carbohydrates for energy.",
    },
    create: {
      slug: "moong-dal-khichdi",
      name: "Moong Dal Khichdi",
      description: "One-pot comfort meal with rice and yellow moong dal, cooked with ghee, cumin, and turmeric.",
      mealTypes: ["LUNCH", "DINNER"],
      cuisineRegion: "NORTH_INDIAN",
      dietaryPatterns: ["VEGETARIAN", "VEGAN"],
      difficultyLevel: "EASY",
      prepTimeMinutes: 5,
      cookTimeMinutes: 20,
      totalTimeMinutes: 25,
      servings: 2,
      costMin: 40,
      costMax: 60,
      tags: ["One-Pot", "High Protein", "Comfort Food"],
      proteinSource: "Moong dal",
      nutritionNote: "Estimated 280–360 kcal per serving depending on rice quantity, ghee, and portion size.",
      whyItWorks: "Dal provides plant-based protein and lysine; rice provides carbohydrates for energy.",
      steps: {
        create: [
          { stepNumber: 1, instruction: "Wash rice and dal together until water runs clear." },
          { stepNumber: 2, instruction: "Heat oil or ghee in a pressure cooker. Add cumin seeds and let splutter." },
          { stepNumber: 3, instruction: "Add onion and turmeric, sauté until translucent." },
          { stepNumber: 4, instruction: "Add washed rice, dal, salt, and water. Pressure cook for 3-4 whistles." },
          { stepNumber: 5, instruction: "Let pressure release naturally, garnish with coriander and serve hot." },
        ],
      },
    },
  });

  // 5. Seed Poha Recipe
  const poha = await prisma.recipe.upsert({
    where: { slug: "poha-peanuts" },
    update: {
      name: "Poha with Peanuts",
      description: "Fluffy flattened rice tossed with mustard seeds, curry leaves, onion, peanuts, and turmeric.",
      mealTypes: ["BREAKFAST", "SNACK"],
      cuisineRegion: "MIXED_INDIAN",
      dietaryPatterns: ["VEGETARIAN", "VEGAN"],
      difficultyLevel: "VERY_EASY",
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      totalTimeMinutes: 15,
      servings: 1,
      costMin: 30,
      costMax: 45,
      tags: ["Quick", "Breakfast", "Beginner-friendly"],
      proteinSource: "Peanuts",
      nutritionNote: "Estimated 220–290 kcal per serving depending on oil and peanut quantity used.",
      whyItWorks: "Poha is a light source of carbohydrates; peanuts add healthy fats and plant protein.",
    },
    create: {
      slug: "poha-peanuts",
      name: "Poha with Peanuts",
      description: "Fluffy flattened rice tossed with mustard seeds, curry leaves, onion, peanuts, and turmeric.",
      mealTypes: ["BREAKFAST", "SNACK"],
      cuisineRegion: "MIXED_INDIAN",
      dietaryPatterns: ["VEGETARIAN", "VEGAN"],
      difficultyLevel: "VERY_EASY",
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      totalTimeMinutes: 15,
      servings: 1,
      costMin: 30,
      costMax: 45,
      tags: ["Quick", "Breakfast", "Beginner-friendly"],
      proteinSource: "Peanuts",
      nutritionNote: "Estimated 220–290 kcal per serving depending on oil and peanut quantity used.",
      whyItWorks: "Poha is a light source of carbohydrates; peanuts add healthy fats and plant protein.",
      steps: {
        create: [
          { stepNumber: 1, instruction: "Rinse poha in a colander under running water for 30 seconds. Drain well." },
          { stepNumber: 2, instruction: "Heat oil in a pan, fry peanuts until golden and crunchy. Remove and set aside." },
          { stepNumber: 3, instruction: "In same oil, crackle mustard seeds and curry leaves. Sauté onions and green chilli." },
          { stepNumber: 4, instruction: "Add turmeric and salt. Mix in the drained poha and roasted peanuts gently." },
          { stepNumber: 5, instruction: "Cover and steam on low for 2 minutes. Finish with lemon juice and coriander." },
        ],
      },
    },
  });

  console.log(`Created recipes: ${khichdi.name}, ${poha.name}`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
