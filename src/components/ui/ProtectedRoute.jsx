'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/auth-store';

export default function ProtectedRoute({ children }) {
  const { user, isLoading, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isInitialized) {
      if (!user) {
        console.log('ProtectedRoute: No hay usuario después de inicializar, redirigiendo a login.');
        router.push('/auth/login');
      }
    }
  }, [user, isLoading, isInitialized, router]);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isLoading && isInitialized && user) {
    return children;
  }
  
  return null;
} 