'use client';
import { useEffect, useState } from 'react';
import { getFavorites } from '@/lib/db';
import { FavoriteRecipe } from '@/types/recipe';
import RecipeCard from '@/components/RecipeCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-6">
        <div className="container mx-auto">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold">⭐ Mis Recetas Favoritas</h1>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No tienes recetas favoritas aún</p>
            <Link href="/search" className="text-blue-600 hover:underline">
              Buscar recetas para agregar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}