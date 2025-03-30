import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lkdwcyfkrsaogthddklw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZHdjeWZrcnNhb2d0aGRka2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzQwODcsImV4cCI6MjA1ODUxMDA4N30.RDHiljboqEk5HtFgin79ZqCvXJxXhBWf3ydbfBDy3jM";

// Verificación y logging de variables de entorno
console.log('URL de Supabase:', supabaseUrl ? 'Configurada' : 'No configurada');
console.log('Clave anónima de Supabase:', supabaseAnonKey ? 'Configurada' : 'No configurada');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan variables de entorno de Supabase. La autenticación no funcionará correctamente.');
}

// Variable para evitar múltiples intentos de inicialización
let initializationAttempts = 0;

// Declarar la variable para exportar
let supabase;

// Cliente básico de Supabase SIN persistencia automática
supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Desactivamos la persistencia automática
    autoRefreshToken: false, // Desactivamos el refresco automático
    detectSessionInUrl: false // Desactivamos detección en URL
  }
});

// Verificar inicialización del cliente
if (!supabase || !supabase.auth) {
  console.error('Error al inicializar cliente de Supabase');
}

console.log('Cliente Supabase inicializado en modo básico');

// Exportar después de la inicialización
export { supabase }; 