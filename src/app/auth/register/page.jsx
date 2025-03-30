'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../../lib/validations/auth';
import { useAuthStore } from '../../../lib/store/auth-store';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const { signUp, isLoading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  
  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setDebugInfo('Iniciando proceso de registro...');
    
    try {
      console.log('Intentando registrar usuario:', data.email);
      
      // Intentar registro directo con Supabase para depuración
      const directResult = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name
          }
        }
      });
      
      setDebugInfo(prev => prev + '\nRespuesta directa de Supabase: ' + 
                   (directResult.error ? 
                   `Error: ${directResult.error.message}` : 
                   `Éxito. Usuario: ${directResult.data?.user?.email || 'No disponible'}`));
      
      if (directResult.error) {
        setError(`Error directo: ${directResult.error.message}`);
        return;
      }
      
      // Usar el store para consistencia en la aplicación
      const result = await signUp(data.email, data.password, data.name);
      
      if (result) {
        setSuccess('Registro exitoso. Por favor verifica tu correo electrónico para confirmar tu cuenta.');
        setDebugInfo(prev => prev + '\nRegistro exitoso a través del store.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError('Error desconocido en el registro');
        setDebugInfo(prev => prev + '\nRegistro falló a través del store. Sin mensaje de error específico.');
      }
    } catch (err) {
      console.error('Error completo en registro:', err);
      setDebugInfo(prev => prev + '\nExcepción capturada: ' + err.message);
      setError(err.message || 'Ha ocurrido un error al registrarse');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-medium">
              Iniciar Sesión
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-800 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/50 border border-green-800 text-green-300 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <Card className="px-4 pt-6 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Nombre"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Tu nombre"
            />
            
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
            
            <Input
              label="Confirmar Contraseña"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="******"
            />
            
            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                Registrarse
              </Button>
            </div>
          </form>
        </Card>
        
        {/* Sección de depuración */}
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-400 font-mono whitespace-pre-wrap">
            {debugInfo}
          </div>
        )}
        
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