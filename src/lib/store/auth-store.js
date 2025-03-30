import { create } from 'zustand';
import { supabase } from '../supabase/client';

// Clave para almacenar manualmente la sesión
const AUTH_STORAGE_KEY = 'finanzas-app-session';

// Intentar recuperar la sesión almacenada manualmente
const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      const now = Math.floor(Date.now() / 1000);
      
      // Verificar si la sesión ha expirado
      if (parsedAuth.expiresAt && parsedAuth.expiresAt > now) {
        console.log('Sesión recuperada de localStorage, válida');
        return parsedAuth.user;
      } else {
        console.log('Sesión encontrada pero expirada, limpiando...');
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  } catch (e) {
    console.error('Error al recuperar sesión:', e);
  }
  
  return null;
};

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  isLoading: false,
  error: null,
  
  // Función para guardar manualmente la sesión
  saveSession: (session, user) => {
    if (typeof window === 'undefined') return;
    
    try {
      // Guardar los datos necesarios
      const sessionData = {
        user,
        token: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at,
        expiresIn: session.expires_in
      };
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      console.log('Sesión guardada manualmente en localStorage');
    } catch (e) {
      console.error('Error al guardar sesión:', e);
    }
  },
  
  // Función para limpiar la sesión
  clearSession: () => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      console.log('Sesión eliminada de localStorage');
    } catch (e) {
      console.error('Error al eliminar sesión:', e);
    }
  },
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Error de inicio de sesión:', error.message);
        set({ error: error.message, isLoading: false });
        return null;
      }
      
      // Guardar manualmente la sesión
      const { saveSession } = get();
      saveSession(data.session, data.user);
      
      set({ 
        user: data.user, 
        isLoading: false,
        error: null
      });
      
      return data;
    } catch (error) {
      console.error('Error inesperado:', error);
      set({ error: error.message || 'Error al iniciar sesión', isLoading: false });
      return null;
    }
  },
  
  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
            full_name: name || ''
          }
        }
      });
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return null;
      }
      
      // Si hay una sesión disponible después del registro, guardarla
      if (data.session) {
        const { saveSession } = get();
        saveSession(data.session, data.user);
        
        set({ 
          user: data.user,
          isLoading: false,
          error: null
        });
      } else {
        set({ isLoading: false });
      }
      
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      set({ error: error.message || 'Error al registrarse', isLoading: false });
      return null;
    }
  },
  
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { clearSession } = get();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      // Limpiar sesión manualmente
      clearSession();
      
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
      set({ error: error.message || 'Error al cerrar sesión', isLoading: false });
    }
  },
  
  checkAuth: async () => {
    const currentState = get();
    
    // Si ya está cargando, evitamos múltiples solicitudes simultáneas
    if (currentState.isLoading) return !!currentState.user;
    
    set({ isLoading: true, error: null });
    try {
      // Primero verificamos si tenemos un usuario en el estado
      if (currentState.user) {
        set({ isLoading: false });
        return true;
      }
      
      // Si no hay usuario en el estado, intentamos obtener la sesión
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error al obtener sesión:', error);
        set({ 
          user: null, 
          error: error.message,
          isLoading: false 
        });
        
        // Limpiar cualquier sesión inválida
        const { clearSession } = get();
        clearSession();
        
        return false;
      }
      
      // Si hay una sesión activa, guardarla y actualizar el estado
      if (data.session) {
        const { saveSession } = get();
        saveSession(data.session, data.session.user);
        
        set({ 
          user: data.session.user, 
          isLoading: false,
          error: null
        });
        
        return true;
      }
      
      // Si no hay sesión, simplemente actualizamos el estado
      set({ 
        user: null,
        isLoading: false 
      });
      
      return false;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      set({ 
        error: error.message || 'Error al verificar autenticación', 
        isLoading: false,
        user: null
      });
      
      return false;
    }
  },
  
  refreshSession: async () => {
    const { session } = get();
    if (!session) return false;
    
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error al refrescar sesión:', error);
        set({ isLoading: false, error: error.message });
        return false;
      }
      
      set({ 
        user: data.user, 
        session: data.session,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      console.error('Error al refrescar sesión:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Error al refrescar sesión' 
      });
      return false;
    }
  }
})); 