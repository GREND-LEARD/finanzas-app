'use client';

import { motion } from 'framer-motion';

export default function CommunityStatsSection() {
  return (
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
  );
} 