'use client';

/**
 * AuthProvider: Actualmente solo pasa los children.
 * La lógica de estado y protección de rutas se maneja 
 * en useAuthStore, AuthInitializer y ProtectedRoute.
 */
export function AuthProvider({ children }) {
  // Simplemente renderiza los hijos
  return <>{children}</>;
} 