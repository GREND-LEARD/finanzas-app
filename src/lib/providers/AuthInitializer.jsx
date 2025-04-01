'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

/**
 * Este componente se encarga de inicializar la suscripción 
 * a los cambios de autenticación de Supabase al cargar la aplicación.
 */
export function AuthInitializer() {
  useEffect(() => {
    console.log('AuthInitializer montado, suscribiendo...');
    const { subscribeAuth, unsubscribeAuth } = useAuthStore.getState();
    subscribeAuth();
    
    // Limpiar la suscripción al desmontar el componente
    return () => {
      console.log('AuthInitializer desmontado, desuscribiendo...');
      unsubscribeAuth();
    };
  }, []); // El array vacío asegura que se ejecute solo al montar/desmontar

  // Este componente no renderiza nada visible en la UI
  return null;
} 