'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Transición automática al Home
    const timer = setTimeout(() => {
      router.push('/');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex flex-col items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="text-8xl mb-4">🍽️</div>
        <h1 className="text-5xl font-bold text-white mb-2">Recetario</h1>
        <p className="text-2xl text-white/90">¡A cocinar!</p>
      </div>
      
      {/* Spinner de carga */}
      <div className="mt-12">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
}