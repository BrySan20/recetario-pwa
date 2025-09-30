'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getRecipeById, getIngredients } from '@/lib/api';
import { Recipe } from '@/types/recipe';
import { saveFavorite, isFavorite, deleteFavorite, savePhoto, getPhoto } from '@/lib/db';
import { notifyFavoriteAdded } from '@/lib/notifications';
import { useVibration } from '@/hooks/useVibration';
import VoiceReader from '@/components/VoiceReader';
import CameraCapture from '@/components/CameraCapture';
import Link from 'next/link';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { vibrate } = useVibration();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  // Cargar receta
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const id = params.id as string;
        const data = await getRecipeById(id);
        setRecipe(data);
        
        if (data) {
          // Dividir instrucciones en pasos
          const instructionSteps = data.strInstructions
            .split(/\r?\n/)
            .filter(s => s.trim().length > 0);
          setSteps(instructionSteps);
          
          // Verificar si es favorito
          const fav = await isFavorite(id);
          setFavorite(fav);
          
          // Cargar foto de usuario (con try-catch por si no existe el store)
          try {
            const photo = await getPhoto(id);
            setUserPhoto(photo);
          } catch (photoError) {
            console.log('No hay foto guardada');
          }
        }
      } catch (error) {
        console.error('Error al cargar receta:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipe();
  }, [params.id]);

  // Agregar/quitar favorito
  const toggleFavorite = async () => {
    if (!recipe) return;
    
    if (favorite) {
      await deleteFavorite(recipe.idMeal);
      setFavorite(false);
    } else {
      await saveFavorite({ ...recipe, savedAt: Date.now() });
      setFavorite(true);
      notifyFavoriteAdded(recipe.strMeal);
    }
  };

  // Siguiente paso con vibración
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      vibrate(200);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Guardar foto capturada
  const handlePhotoCapture = async (photoBase64: string) => {
    if (recipe) {
      await savePhoto(recipe.idMeal, photoBase64);
      setUserPhoto(photoBase64);
      setShowCamera(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Receta no encontrada</p>
      </div>
    );
  }

  const ingredients = getIngredients(recipe);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md p-4">
          <Link href="/" className="text-blue-600 hover:underline">← Volver</Link>
        </header>

        <div className="container mx-auto p-6 max-w-4xl">
          {/* Imagen principal */}
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Título y acciones */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{recipe.strMeal}</h1>
              <p className="text-gray-600">{recipe.strCategory} • {recipe.strArea}</p>
            </div>
            <button
              onClick={toggleFavorite}
              className={`px-6 py-3 rounded-lg font-bold ${
                favorite ? 'bg-yellow-400' : 'bg-gray-200'
              }`}
            >
              {favorite ? '⭐ Favorito' : '☆ Agregar'}
            </button>
          </div>

          {/* Ingredientes */}
          <section className="bg-white rounded-lg p-6 mb-6 shadow">
            <h2 className="text-2xl font-bold mb-4">Ingredientes</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ingredients.map((ing, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-medium">{ing.ingredient}:</span>
                  <span className="text-gray-600">{ing.measure}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sistema de pasos con vibración */}
          <section className="bg-white rounded-lg p-6 mb-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Preparación</h2>
              <VoiceReader text={steps.join('. ')} />
            </div>

            {steps.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Paso {currentStep + 1} de {steps.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={currentStep === steps.length - 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      📳 Siguiente
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg">{steps[currentStep]}</p>
                </div>
              </div>
            )}
          </section>

          {/* Cámara para foto del platillo */}
          <section className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-2xl font-bold mb-4">Tu Platillo Terminado</h2>
            {userPhoto ? (
              <div className="space-y-4">
                <img src={userPhoto} alt="Platillo" className="w-full rounded-lg" />
                <button
                  onClick={() => setShowCamera(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                >
                  📷 Tomar Nueva Foto
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCamera(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg"
              >
                📷 Tomar Foto del Platillo
              </button>
            )}
          </section>
        </div>
      </div>

      {/* Modal de cámara */}
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}