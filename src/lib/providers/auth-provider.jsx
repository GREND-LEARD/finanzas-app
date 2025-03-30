'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/auth-store';
import { supabase } from '../supabase/client';

export function AuthProvider({ children }) {
  const { user, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar la autenticación cuando se carga la aplicación
  useEffect(() => {
    let isMounted = true;
    
    const checkUserAuth = async () => {
      try {
        await checkAuth();
        if (isMounted) {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          checkAuth();
        }
      }
    );

    checkUserAuth();

    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [checkAuth]);

  // Evitamos que las redirecciones automáticas ocurran en el provider
  // para no interferir con el ProtectedRoute
  
  return <>{children}</>;
} 