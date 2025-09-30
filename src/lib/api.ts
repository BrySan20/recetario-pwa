import { Recipe, MealDBResponse } from '@/types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Obtener recetas aleatorias
export async function getRandomRecipes(count: number = 6): Promise<Recipe[]> {
  const recipes: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const res = await fetch(`${BASE_URL}/random.php`, { cache: 'no-store' });
    const data: MealDBResponse = await res.json();
    if (data.meals) recipes.push(data.meals[0]);
  }
  return recipes;
}

// Buscar recetas por nombre
export async function searchRecipes(query: string): Promise<Recipe[]> {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data: MealDBResponse = await res.json();
  return data.meals || [];
}

// Obtener receta por ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data: MealDBResponse = await res.json();
  return data.meals ? data.meals[0] : null;
}

// Obtener ingredientes de una receta
export function getIngredients(recipe: Recipe): { ingredient: string; measure: string }[] {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
    const measure = recipe[`strMeasure${i}` as keyof Recipe];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure: measure || '' });
    }
  }
  return ingredients;
}