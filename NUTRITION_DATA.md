# Nutrition Data & Philosophy

## Core Philosophy
NutriFlow is a **practical meal planning tool**, not a medical diagnostic device. It focuses on the question: *"What practical meal can I eat next based on my context?"* rather than precise calorie counting.

## Data Structure
- `NutrientDefinition`: Defines a specific nutrient (e.g., Protein, Vitamin C) and its standard unit.
- `FoodNutrient`: Maps a specific quantity of a nutrient to an ingredient.

## Deterministic Heuristics
The app scores recipes based on rules, not black-box machine learning. For example:
- **Protein Check:** Does this meal include a primary protein source? (e.g., Dal, Paneer, Eggs).
- **Dietary Filter:** Does this meal strictly adhere to a Jain, Vegan, or Vegetarian diet?

## Disclaimers
All nutritional figures provided in the UI are **estimates**. They rely on standard approximations and do not account for variations in:
- Cooking oil/fat quantities.
- Natural produce variations.
- Specific brand differences in packaged goods.

**Users with severe allergies or medical conditions must consult healthcare professionals and verify ingredient labels manually.**
