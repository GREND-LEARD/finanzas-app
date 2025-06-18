'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

/**
 * Componente para inicializar la autenticación automáticamente
 * Se encarga de suscribirse a los cambios de autenticación de Supabase
 * al cargar la aplicación y cancelar la suscripción al desmontar.
 */
export function AuthInitializer() {
  useEffect(() => {
    const { subscribeAuth, unsubscribeAuth } = useAuthStore.getState();
    
    // Suscribirse a cambios de autenticación
    subscribeAuth();
    
    // Limpiar la suscripción al desmontar el componente
    return () => {
      unsubscribeAuth();
    };
  }, []);

  return null; // Este componente no renderiza nada visible
} 