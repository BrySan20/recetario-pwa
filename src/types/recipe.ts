// Tipos para recetas de TheMealDB
export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

// Receta favorita local
export interface FavoriteRecipe extends Recipe {
  savedAt: number;
  userPhoto?: string;
}

// Respuesta API
export interface MealDBResponse {
  meals: Recipe[] | null;
}