'use client';
import { useState } from 'react';
import { searchRecipes } from '@/lib/api';
import { Recipe } from '@/types/recipe';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import Link from 'next/link';
import { useOffline } from '@/hooks/useOffline';

// Página de búsqueda con CSR
export default function SearchPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const isOffline = useOffline();

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const results = await searchRecipes(query);
      setRecipes(results);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setRecipes([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-6">
        <div className="container mx-auto">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold mb-4">Buscar Recetas</h1>
          <SearchBar onSearch={handleSearch} />
          {isOffline && (
            <p className="text-red-600 mt-4">⚠️ Sin conexión - Mostrando resultados en caché</p>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Buscando recetas...</p>
          </div>
        )}

        {!loading && searched && recipes.length === 0 && (
          <p className="text-center text-gray-600 py-12">No se encontraron recetas</p>
        )}

        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        )}

        {!searched && !loading && (
          <p className="text-center text-gray-600 py-12">Usa la barra de búsqueda para encontrar recetas</p>
        )}
      </main>
    </div>
  );
}