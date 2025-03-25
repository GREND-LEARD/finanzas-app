'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaChartLine, FaWallet, FaRegCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import StatsSection from '../components/home/StatsSection';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <FaChartLine className="w-8 h-8 text-[#00E676]" />,
      title: "Análisis detallado",
      description: "Visualiza tus finanzas con gráficos interactivos que te permiten entender claramente tus hábitos financieros."
    },
    {
      icon: <FaWallet className="w-8 h-8 text-[#00E676]" />,
      title: "Gestión de gastos",
      description: "Registra fácilmente tus ingresos y gastos por categorías, para mantener todo organizado."
    },
    {
      icon: <FaRegCalendarAlt className="w-8 h-8 text-[#00E676]" />,
      title: "Presupuestos mensuales",
      description: "Establece límites de gastos y recibe alertas cuando estés por excederlos."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-[#00E676]" />,
      title: "Seguridad garantizada",
      description: "Tus datos financieros están protegidos con la más alta tecnología de encriptación."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
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
                  <img
                    className="w-full"
                    src="/images/dashboard-preview.png"
                    alt="Dashboard preview"
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

      {/* Features Section */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-base font-semibold text-[#00E676] tracking-wide uppercase"
            >
              FUNCIONALIDADES
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-2 text-3xl font-extrabold text-white sm:text-4xl"
            >
              Todo lo que necesitas para gestionar tus finanzas
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto"
            >
              Nuestra aplicación te proporciona todas las herramientas necesarias para llevar un control completo de tus finanzas personales.
            </motion.p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="pt-6"
                >
                  <div className="flow-root bg-gray-900 rounded-lg px-6 pb-8 h-full border border-gray-800">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-white tracking-tight">{feature.title}</h3>
                      <p className="mt-5 text-base text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards Section */}
      <StatsSection />

      {/* Stats Section */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-extrabold text-white sm:text-4xl"
            >
              Utilizado por miles de personas
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 text-xl text-gray-300 sm:mt-4"
            >
              Únete a nuestra comunidad y toma el control de tus finanzas personales
            </motion.p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <dt className="order-2 mt-2 text-lg font-medium text-gray-400">
                Usuarios activos
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-[#00E676]">10,000+</dd>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col mt-10 sm:mt-0"
            >
              <dt className="order-2 mt-2 text-lg font-medium text-gray-400">
                Transacciones
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-[#00E676]">500K+</dd>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col mt-10 sm:mt-0"
            >
              <dt className="order-2 mt-2 text-lg font-medium text-gray-400">
                Satisfacción
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-[#00E676]">99%</dd>
            </motion.div>
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">¿Listo para comenzar?</span>
              <span className="block text-[#00E676]">Regístrate hoy y toma control de tus finanzas.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Empieza gratis y mejora tu vida financiera. No se requiere tarjeta de crédito.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
          >
            <div className="inline-flex rounded-md shadow">
              <Link href="/auth/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#00E676] hover:bg-[#69F0AE]">
                Empezar ahora
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/features" className="inline-flex items-center justify-center px-5 py-3 border border-[#00E676] text-base font-medium rounded-md text-[#00E676] bg-transparent hover:bg-gray-700">
                Ver más
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <h2 className="text-2xl font-bold text-white">FinanzasApp</h2>
              <p className="text-gray-300 text-base">
                Haciendo tus finanzas personales simples y efectivas desde 2023.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-[#00E676]">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00E676]">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00E676]">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Soluciones</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Presupuestos</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Análisis</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Ahorro</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Metas</a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Soporte</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Precios</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Documentación</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Guías</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">API Status</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Empresa</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Sobre nosotros</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Blog</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Empleos</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Prensa</a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Privacidad</a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-[#00E676]">Términos</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2023 FinanzasApp. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 