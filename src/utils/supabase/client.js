import { createBrowserClient } from "@supabase/ssr";

/**
 * Crea un cliente de Supabase para el navegador
 * @returns {import('@supabase/supabase-js').SupabaseClient} Cliente de Supabase
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ); 