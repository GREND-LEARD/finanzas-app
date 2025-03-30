'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/auth-store';

export default function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Verificar autenticación
        console.log('Verificando autenticación...');
        const isAuthenticated = await checkAuth();
        
        if (!isAuthenticated) {
          console.log('No autenticado, redirigiendo a login...');
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        router.push('/auth/login');
      } finally {
        // Siempre terminar el estado de carga
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [checkAuth, router]);

  // Timeout de seguridad para evitar bloqueos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('Timeout de carga alcanzado');
        setIsLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Mostrar spinner mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Si hay usuario o la carga terminó, mostrar el contenido
  return children;
} 