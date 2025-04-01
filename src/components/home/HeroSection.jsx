'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaChartLine } from 'react-icons/fa';

export default function HeroSection({ isVisible, fadeIn }) {
  return (
    <header className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <motion.h1
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              <span className="block">Toma el control</span>{' '}
              <span className="block text-[#00E676]">de tus finanzas personales</span>
            </motion.h1>
            <motion.p
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
            >
              Una aplicación completa para gestionar tus ingresos, gastos y generar reportes visuales que te ayuden a entender mejor tus hábitos financieros.
            </motion.p>
            <motion.div 
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0"
            >
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/auth/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#00E676] hover:bg-[#69F0AE] md:py-4 md:text-lg md:px-10">
                    Comenzar ahora <span className="ml-2">→</span>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/auth/login" className="w-full flex items-center justify-center px-8 py-3 border border-[#00E676] text-base font-medium rounded-md text-[#00E676] bg-transparent hover:bg-gray-800 md:py-4 md:text-lg md:px-10">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Saber más
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
            <div className="mt-5 text-sm text-gray-400 text-center lg:text-left">
              ¿Ya tienes una cuenta? <Link href="/auth/login" className="text-[#00E676] hover:text-[#69F0AE]">Iniciar sesión</Link>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md"
            >
              <div className="relative block w-full bg-gray-800 rounded-lg overflow-hidden">
                {/* Usar componente Image de Next.js si la imagen está en /public */}
                <Image
                  className="w-full"
                  src="/images/dashboard-preview.png" 
                  alt="Dashboard preview"
                  width={500} // Añadir width y height o layout='fill'
                  height={300}
                  priority // Considerar priority si está above the fold
                />
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <div className="bg-gray-900 bg-opacity-75 backdrop-filter backdrop-blur-sm p-6 rounded-lg">
                    <div className="flex items-center justify-center">
                      <div className="h-12 w-12 rounded-md flex items-center justify-center bg-[#00E676]">
                        <FaChartLine className="h-6 w-6 text-gray-900" />
                      </div>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-lg leading-6 font-medium text-white">
                        Visualiza tus finanzas
                      </h3>
                      <p className="mt-2 text-sm text-gray-300">
                        Prueba gratis por 14 días
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
} 