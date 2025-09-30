import Link from 'next/link';
import { getRandomRecipes } from '@/lib/api';
import RecipeCard from '@/components/RecipeCard';

// Página Home con SSR
export default async function HomePage() {
  const featuredRecipes = await getRandomRecipes(6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-2">🍽️ Recetario Interactivo</h1>
          <p className="text-white/90">Descubre y cocina deliciosas recetas</p>
        </div>
      </header>

      {/* Navegación */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex gap-4 justify-center">
          <Link 
            href="/search" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🔍 Buscar Recetas
          </Link>
          <Link 
            href="/favorites" 
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ⭐ Mis Favoritos
          </Link>
        </div>
      </nav>

      {/* Recetas Destacadas */}
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Recetas Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      </main>
    </div>
  );
}