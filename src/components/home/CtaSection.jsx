'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CtaSection() {
  return (
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
            {/* Este enlace a /features podría requerir una página o sección específica */}
            <Link href="/features" className="inline-flex items-center justify-center px-5 py-3 border border-[#00E676] text-base font-medium rounded-md text-[#00E676] bg-transparent hover:bg-gray-700">
              Ver más
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 