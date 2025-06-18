'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Proveedor de React Query para toda la aplicación
 * Configurado para optimizar el rendimiento con tiempos de caché y políticas de reintento
 * 
 * @param {object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Provider configurado con QueryClient
 */
export function ReactQueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configuración para optimizar el rendimiento
        staleTime: 60 * 1000, // 1 minuto antes de considerar los datos obsoletos
        cacheTime: 5 * 60 * 1000, // 5 minutos de caché
        refetchOnWindowFocus: false, // No recargar al enfocar la ventana
        retry: (failureCount, error) => {
          // No reintentar en errores 404 o 401
          if (error?.status === 404 || error?.status === 401) return false;
          // Máximo 2 reintentos para otros errores
          return failureCount < 2;
        }
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 