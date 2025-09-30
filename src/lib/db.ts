import { FavoriteRecipe } from '@/types/recipe';

const DB_NAME = 'RecetarioDB';
const FAVORITES_STORE = 'favorites';
const PHOTOS_STORE = 'photos';

// Abrir/crear base de datos
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Incrementar versión
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      
      // Crear store de favoritos
      if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
        db.createObjectStore(FAVORITES_STORE, { keyPath: 'idMeal' });
      }
      
      // Crear store de fotos
      if (!db.objectStoreNames.contains(PHOTOS_STORE)) {
        db.createObjectStore(PHOTOS_STORE, { keyPath: 'recipeId' });
      }
    };
  });
}

// Guardar receta favorita
export async function saveFavorite(recipe: FavoriteRecipe): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(FAVORITES_STORE, 'readwrite');
  tx.objectStore(FAVORITES_STORE).put(recipe);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Obtener favoritos
export async function getFavorites(): Promise<FavoriteRecipe[]> {
  const db = await openDB();
  const tx = db.transaction(FAVORITES_STORE, 'readonly');
  const store = tx.objectStore(FAVORITES_STORE);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Eliminar favorito
export async function deleteFavorite(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(FAVORITES_STORE, 'readwrite');
  tx.objectStore(FAVORITES_STORE).delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Verificar si es favorito
export async function isFavorite(id: string): Promise<boolean> {
  const db = await openDB();
  const tx = db.transaction(FAVORITES_STORE, 'readonly');
  const request = tx.objectStore(FAVORITES_STORE).get(id);
  return new Promise((resolve) => {
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => resolve(false);
  });
}

// Guardar foto de usuario
export async function savePhoto(recipeId: string, photoBase64: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(PHOTOS_STORE, 'readwrite');
  tx.objectStore(PHOTOS_STORE).put({ recipeId, photo: photoBase64 });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Obtener foto
export async function getPhoto(recipeId: string): Promise<string | null> {
  const db = await openDB();
  const tx = db.transaction(PHOTOS_STORE, 'readonly');
  const request = tx.objectStore(PHOTOS_STORE).get(recipeId);
  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result?.photo || null);
    request.onerror = () => resolve(null);
  });
}