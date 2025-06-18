import { createClient } from '@/utils/supabase/client';

// Crear una instancia del cliente para la aplicación
const supabase = createClient();

// Exportar el cliente de Supabase para uso en la aplicación
export { supabase };