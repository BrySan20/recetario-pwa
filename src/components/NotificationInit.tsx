'use client';
import { useEffect } from 'react';
import { requestNotificationPermission, registerServiceWorker } from '@/lib/notifications';

// Componente para inicializar notificaciones y SW
export default function NotificationInit() {
  useEffect(() => {
    // Registrar SW y solicitar permisos
    const init = async () => {
      await registerServiceWorker();
      
      // Esperar interacción del usuario para pedir permisos
      setTimeout(() => {
        requestNotificationPermission();
      }, 3000);
    };
    
    init();
  }, []);

  return null;
}