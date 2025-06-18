'use client';

/**
 * Proveedor de autenticación para la aplicación
 * La lógica real de autenticación se maneja en useAuthStore,
 * AuthInitializer y ProtectedRoute.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Los hijos envueltos por el proveedor
 */
export function AuthProvider({ children }) {
  // Simplemente renderiza los hijos
  return <>{children}</>;
} 