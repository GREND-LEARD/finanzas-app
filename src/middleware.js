import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

/**
 * Middleware para manejar la autenticación de rutas
 * @param {import('next/server').NextRequest} request - Solicitud entrante
 * @returns {import('next/server').NextResponse} Respuesta (redirección o continuar)
 */
export async function middleware(request) {
  // Crear el cliente de Supabase
  const { supabase, response } = createClient(request);

  // Obtener la sesión del usuario
  const { data: { session } } = await supabase.auth.getSession();

  // Determinar la ruta actual
  const path = new URL(request.url).pathname;

  // Rutas que requieren autenticación
  const authRequiredPaths = path.startsWith('/dashboard');
  
  // Rutas solo para usuarios no autenticados
  const authRestrictedPaths = path.startsWith('/auth');

  // Redirigir usuarios no autenticados al login
  if (authRequiredPaths && !session) {
    const redirectUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirigir usuarios autenticados al dashboard
  if (authRestrictedPaths && session) {
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Continuar con la solicitud para todas las demás rutas
  return response;
}

// Definir las rutas donde se aplicará el middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
}; 