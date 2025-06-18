import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Crea un cliente de Supabase para el servidor
 * @param {ReturnType<typeof cookies>} cookieStore - Almacén de cookies de Next.js
 * @returns {import('@supabase/supabase-js').SupabaseClient} Cliente de Supabase
 */
export const createClient = (cookieStore) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Capturamos errores por si el usuario tiene configuraciones estrictas de privacidad
        }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Capturamos errores por si el usuario tiene configuraciones estrictas de privacidad
          }
        },
      },
    }
  );
};
