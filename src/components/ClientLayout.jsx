'use client';

import React, { useEffect } from 'react';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { ReactQueryProvider } from '@/lib/providers/react-query-provider';
import { AuthInitializer } from '@/lib/providers/AuthInitializer';
import { useSettingsStore } from '@/lib/store/settings-store';

/**
 * Componente ThemeInitializer para aplicar el tema del usuario
 */
function ThemeInitializer() {
  const { theme } = useSettingsStore();
  
  useEffect(() => {
    // Aplicar clase dark al elemento HTML si el tema es oscuro
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return null;
}

/**
 * Componente de Layout del lado del cliente
 * Contiene todos los providers y la inicialización de tema
 * @param {object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export default function ClientLayout({ children }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <AuthInitializer />
        <ThemeInitializer />
        {children}
      </AuthProvider>
    </ReactQueryProvider>
  );
} 