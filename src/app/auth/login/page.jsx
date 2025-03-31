'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEnvelope, FaLock, FaChartBar, FaUserFriends, FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth-store';

// Esquema de validación para el formulario
const loginSchema = z.object({
  email: z.string().email("Introduce un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es requerida")
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const result = await signIn(data.email, data.password);
      if (result) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setError(error.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Panel lateral izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 p-12 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-4xl font-bold text-white mb-6">
            ¡Bienvenido de nuevo!
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Accede a tu cuenta para continuar gestionando tus finanzas de manera inteligente.
          </p>
          
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#00E676] bg-opacity-20 flex items-center justify-center">
                  <FaChartBar className="w-6 h-6 text-[#00E676]" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Análisis Detallado</h3>
                <p className="text-gray-400">Visualiza tus tendencias financieras con gráficos avanzados</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#00E676] bg-opacity-20 flex items-center justify-center">
                  <FaUserFriends className="w-6 h-6 text-[#00E676]" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Comparte con Familia</h3>
                <p className="text-gray-400">Gestiona finanzas familiares de manera colaborativa</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#00E676] bg-opacity-20 flex items-center justify-center">
                  <FaBell className="w-6 h-6 text-[#00E676]" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Notificaciones Inteligentes</h3>
                <p className="text-gray-400">Recibe alertas personalizadas sobre tus finanzas</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Panel de inicio de sesión */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg"
        >
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white"
            >
              Iniciar sesión
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-gray-400"
            >
              Ingresa tus credenciales para continuar
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500 bg-opacity-20 p-3 rounded-md"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="rounded-md shadow-sm space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Correo electrónico
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    {...register('email')}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="pl-10 py-2 px-4 block w-full bg-gray-700 border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs mt-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    {...register('password')}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="pl-10 py-2 px-4 block w-full bg-gray-700 border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                    placeholder="******"
                  />
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs mt-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-[#00E676] hover:bg-[#69F0AE] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E676] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-4"
          >
            <p className="text-sm text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/register" className="font-medium text-[#00E676] hover:text-[#69F0AE]">
                Regístrate
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 