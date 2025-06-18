import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Crea un cliente de Supabase para el middleware
 * @param {import('next/server').NextRequest} request - Objeto de solicitud de Next.js
 * @returns {{supabase: import('@supabase/supabase-js').SupabaseClient, response: import('next/server').NextResponse}} Cliente de Supabase y respuesta
 */
export const createClient = (request) => {
  // Crear un objeto de respuesta inicial
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // Configurar la cookie en la solicitud
          request.cookies.set({
            name,
            value,
            ...options,
          });
          
          // Actualizar la cookie en la respuesta
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          // Eliminar la cookie de la solicitud
          request.cookies.delete({
            name,
            ...options,
          });
          
          // Eliminar la cookie de la respuesta
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
}; 