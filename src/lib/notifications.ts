// Solicitar permiso de notificaciones
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Enviar notificación local
export function sendNotification(title: string, body: string, icon?: string): void {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png'
    });
  }
}

// Notificación al agregar favorito
export function notifyFavoriteAdded(recipeName: string): void {
  sendNotification(
    '¡Receta guardada!',
    `${recipeName} se agregó a tus favoritos. ¿Listo para cocinar?`
  );
}

// Registrar Service Worker para notificaciones push
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registrado:', registration);
      return registration;
    } catch (error) {
      console.error('Error al registrar SW:', error);
      return null;
    }
  }
  return null;
}