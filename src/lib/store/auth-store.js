import { create } from 'zustand';
import { supabase } from '../supabase/client';

// Ya no necesitamos la clave ni las funciones manuales de localStorage
// const AUTH_STORAGE_KEY = 'finanzas-app-session';
// const getStoredUser = () => { ... };

// Variable para almacenar la suscripción a onAuthStateChange
let authListener = null;

export const useAuthStore = create((set, get) => ({
  // Inicializamos user a null. checkAuth o onAuthStateChange lo poblarán.
  user: null, 
  isLoading: true, // Empezamos como cargando hasta que checkAuth termine
  error: null,
  isInitialized: false, // Para saber si la autenticación inicial ya se comprobó

  // Ya no necesitamos saveSession ni clearSession
  // saveSession: (session, user) => { ... },
  // clearSession: () => { ... },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Supabase se encarga de la sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Error de inicio de sesión:', error.message);
        set({ error: error.message, isLoading: false, user: null });
        return null; 
      }
      
      // No necesitamos guardar manualmente
      // const { saveSession } = get();
      // saveSession(data.session, data.user);
      
      // El listener onAuthStateChange actualizará el usuario, 
      // pero podemos establecerlo aquí para una respuesta más rápida en la UI.
      set({ 
        user: data.user, 
        isLoading: false,
        error: null
      });
      
      return data.user; // Devolver solo el usuario o la sesión si es necesario
    } catch (error) {
      console.error('Error inesperado en signIn:', error);
      set({ error: error.message || 'Error al iniciar sesión', isLoading: false, user: null });
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
            // Asegúrate de que Supabase esté configurado para aceptar 'name' en los metadatos
            name // Puedes usar raw_user_meta_data o similar si lo prefieres
          },
          // Si usas verificación de correo, asegúrate que esta URL exista
          // emailRedirectTo: `${window.location.origin}/auth/callback`, // Usualmente una ruta /callback
        }
      });
      
      if (error) {
        console.error('Error en signUp:', error.message);
        set({ error: error.message, isLoading: false, user: null });
        return null;
      }
      
      // No necesitamos guardar sesión manualmente.
      // Supabase maneja el usuario/sesión después del registro (si la verificación no es obligatoria)
      // onAuthStateChange se encargará si hay sesión inmediatamente.
      
      set({ 
        // user: data.user, // Mejor dejar que onAuthStateChange lo maneje
        isLoading: false, 
        error: null 
      }); 
      
      console.log('Registro iniciado, revisa tu correo si la verificación está habilitada.');
      return data.user || data.session; // Devolver usuario o sesión si existe
    } catch (error) {
      console.error('Error inesperado en signUp:', error);
      set({ error: error.message || 'Error al registrarse', isLoading: false, user: null });
      return null;
    }
  },
  
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      // No necesitamos limpiar manualmente
      // const { clearSession } = get();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error.message);
        // Aún así limpiamos el estado local
        set({ error: error.message, isLoading: false, user: null });
        return;
      }
      
      // onAuthStateChange se encargará de poner user a null
      set({ user: null, isLoading: false }); 
      console.log('Sesión cerrada');
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
      set({ error: error.message || 'Error al cerrar sesión', isLoading: false, user: null });
    }
  },
  
  // checkAuth se puede usar para la carga inicial
  checkAuth: async () => {
    const { isInitialized } = get();
    // Evitar comprobaciones múltiples si ya se inicializó
    if (isInitialized) return;

    console.log('Verificando autenticación inicial...');
    set({ isLoading: true });
    try {
      // getSession lee la sesión persistida por Supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error al obtener sesión inicial:', error.message);
        set({ user: null, error: error.message, isLoading: false, isInitialized: true });
        return;
      }
      
      console.log('Sesión inicial obtenida:', data.session ? 'Sí' : 'No');
      set({ 
        user: data.session?.user ?? null, 
        isLoading: false,
        error: null,
        isInitialized: true
      });

    } catch (error) {
      console.error('Error inesperado en checkAuth:', error);
      set({ 
        user: null, 
        error: error.message || 'Error al verificar autenticación', 
        isLoading: false, 
        isInitialized: true 
      });
    }
  },

  // Función para suscribirse a los cambios de autenticación
  subscribeAuth: () => {
    if (authListener) {
      console.log('Ya suscrito a cambios de autenticación.');
      return; // Evitar múltiples suscripciones
    }

    console.log('Suscribiéndose a cambios de autenticación...');
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Evento Auth:', event, 'Sesión:', session ? 'Sí' : 'No');
      set({ user: session?.user ?? null, isInitialized: true, isLoading: false });
      
      // Puedes manejar eventos específicos si es necesario
      // if (event === 'PASSWORD_RECOVERY') { ... }
      // if (event === 'USER_UPDATED') { ... }
    });

    authListener = data.subscription;
    
    // Llamar a checkAuth la primera vez para obtener el estado inicial rápidamente
    get().checkAuth();
  },

  // Función para cancelar la suscripción
  unsubscribeAuth: () => {
    if (authListener) {
      console.log('Cancelando suscripción a cambios de autenticación.');
      authListener.unsubscribe();
      authListener = null;
    }
  }

  // Ya no necesitamos refreshSession
  // refreshSession: async () => { ... }
})); 

// Eliminar la función register externa y redundante
// export async function register(email, password, name) { ... } 