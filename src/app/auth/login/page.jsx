'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../lib/validations/auth';
import { useAuthStore } from '../../../lib/store/auth-store';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const { signIn, isLoading, error: authError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data) => {
    setError('');
    setDebugInfo('Iniciando proceso de login...');
    
    try {
      console.log('Intentando iniciar sesión con:', data.email);
      
      // Intentar inicio de sesión directamente con Supabase para depuración
      const directResult = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      setDebugInfo(prev => prev + '\nRespuesta directa de Supabase: ' + 
                   (directResult.error ? 
                    `Error: ${directResult.error.message}` : 
                    `Éxito. Usuario: ${directResult.data?.user?.email || 'No disponible'}`));
      
      if (directResult.error) {
        setError(`Error directo: ${directResult.error.message}`);
        return;
      }
      
      // Si el inicio de sesión directo funciona, almacenar manualmente en localStorage
      if (directResult.data?.session) {
        // Forzar almacenamiento manual de sesión
        try {
          // Guardar en el formato que espera Supabase
          const sessionData = {
            access_token: directResult.data.session.access_token,
            refresh_token: directResult.data.session.refresh_token,
            expires_at: directResult.data.session.expires_at,
            expires_in: directResult.data.session.expires_in,
            token_type: 'bearer',
            user: directResult.data.user
          };
          
          localStorage.setItem('finanzas-app-auth-token', JSON.stringify(sessionData));
          setDebugInfo(prev => prev + '\nSesión guardada manualmente en localStorage con formato correcto.');
          
          // Esta línea es importante: actualizar manualmente el estado de usuario
          // para que ProtectedRoute funcione correctamente
          window.dispatchEvent(new Event('supabase.auth.signin'));
        } catch (storageError) {
          console.error('Error al guardar en localStorage:', storageError);
          setDebugInfo(prev => prev + '\nError al guardar en localStorage: ' + storageError.message);
        }
      }
      
      // Si el inicio de sesión directo funciona, usar el store para consistencia
      const result = await signIn(data.email, data.password);
      
      setDebugInfo(prev => prev + '\nRespuesta del store: ' + 
                   (result ? `Éxito. Redirigiendo...` : `Fallo. Error: ${authError || 'Desconocido'}`));
      
      // Si tenemos datos de usuario, redirigir aunque haya problemas con el store
      if (result || directResult.data?.user) {
        setDebugInfo(prev => prev + '\nRedirigiendo al dashboard...');
        
        // Usar timeout para asegurar que los datos se guarden antes de redirigir
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError(authError || 'No se pudo iniciar sesión. Verifica tus credenciales.');
      }
    } catch (err) {
      console.error('Error completo en login:', err);
      setDebugInfo(prev => prev + '\nExcepción capturada: ' + err.message);
      setError(err.message || 'Ha ocurrido un error al iniciar sesión');
    }
  };
  
  // Función para verificar la sesión actual
  const checkCurrentSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setDebugInfo(`Sesión actual: ${data.session ? 'Activa' : 'Inactiva'}`);
      if (data.session) {
        setDebugInfo(prev => prev + `\nUsuario en sesión: ${data.session.user.email}`);
      }
    } catch (error) {
      setDebugInfo(`Error al verificar sesión: ${error.message}`);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" className="text-green-400 hover:text-green-300 font-medium">
              Regístrate
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-800 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <Card className="px-4 pt-6 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="tu@email.com"
            />
            
            <Input
              label="Contraseña"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="******"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
                  Recordarme
                </label>
              </div>
              
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="text-green-400 hover:text-green-300">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </Card>
        
        {/* Sección de depuración */}
        <div className="mt-4">
          <button 
            onClick={checkCurrentSession} 
            className="text-xs text-gray-500 hover:text-gray-400"
          >
            Verificar estado de sesión
          </button>
          
          {debugInfo && (
            <div className="mt-2 p-3 bg-gray-800 rounded text-xs text-gray-400 font-mono whitespace-pre-wrap">
              {debugInfo}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-gray-300 text-sm flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
} 