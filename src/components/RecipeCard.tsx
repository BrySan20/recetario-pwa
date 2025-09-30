import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import Image from 'next/image';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipe/${recipe.idMeal}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
        <div className="relative h-48 w-full">
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{recipe.strMeal}</h3>
          <p className="text-sm text-gray-600">{recipe.strCategory} • {recipe.strArea}</p>
        </div>
      </div>
    </Link>
  );
}