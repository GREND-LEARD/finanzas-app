import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';

// Variable para almacenar la suscripción a onAuthStateChange
let authListener = null;

/**
 * Store de autenticación con Zustand
 */
export const useAuthStore = create((set, get) => ({
  user: null, // Usuario actual
  isLoading: true, // Estado de carga
  error: null, // Error si existe
  isInitialized: false, // Indica si la autenticación fue inicializada

  /**
   * Inicia sesión con correo y contraseña
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise<Object|null>} Usuario autenticado o null
   */
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        set({ error: error.message, isLoading: false, user: null });
        return null; 
      }
      
      // Establecer usuario para respuesta inmediata en UI
      set({ 
        user: data.user, 
        isLoading: false,
        error: null
      });
      
      return data.user;
    } catch (error) {
      set({ error: error.message || 'Error al iniciar sesión', isLoading: false, user: null });
      return null;
    }
  },
  
  /**
   * Registra un nuevo usuario
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @param {string} name - Nombre del usuario
   * @returns {Promise<Object|null>} Usuario registrado o null
   */
  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        set({ error: error.message, isLoading: false, user: null });
        return null;
      }
      
      set({ isLoading: false, error: null }); 
      
      return data.user || data.session;
    } catch (error) {
      set({ error: error.message || 'Error al registrarse', isLoading: false, user: null });
      return null;
    }
  },
  
  /**
   * Cierra la sesión actual
   * @returns {Promise<void>}
   */
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        set({ error: error.message, isLoading: false, user: null });
        return;
      }
      
      set({ user: null, isLoading: false }); 
    } catch (error) {
      set({ error: error.message || 'Error al cerrar sesión', isLoading: false, user: null });
    }
  },
  
  /**
   * Verifica el estado de autenticación inicial
   * @returns {Promise<void>}
   */
  checkAuth: async () => {
    const { isInitialized } = get();
    if (isInitialized) return;

    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        set({ user: null, error: error.message, isLoading: false, isInitialized: true });
        return;
      }
      
      set({ 
        user: data.session?.user ?? null, 
        isLoading: false,
        error: null,
        isInitialized: true
      });

    } catch (error) {
      set({ 
        user: null, 
        error: error.message || 'Error al verificar autenticación', 
        isLoading: false, 
        isInitialized: true 
      });
    }
  },

  /**
   * Suscribe el store a los cambios de autenticación
   */
  subscribeAuth: () => {
    if (authListener) return;

    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      set({ user: session?.user ?? null, isInitialized: true, isLoading: false });
    });

    authListener = data.subscription;
    
    get().checkAuth();
  },

  /**
   * Cancela la suscripción a cambios de autenticación
   */
  unsubscribeAuth: () => {
    if (authListener) {
      authListener.unsubscribe();
      authListener = null;
    }
  }
})); 

// Eliminar la función register externa y redundante
// export async function register(email, password, name) { ... } 