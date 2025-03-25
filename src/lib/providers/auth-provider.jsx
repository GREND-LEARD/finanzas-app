'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';

export function AuthProvider({ children }) {
  const { checkAuth } = useAuthStore();
  
  // Verificar la autenticación cuando se carga la aplicación
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return <>{children}</>;
} 