'use client';

import { motion } from 'framer-motion';

// No necesitamos los iconos aquí ya que vienen en las props

export default function FeaturesSection({ features }) {
  return (
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
                        {/* El icono viene de las props */}
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
  );
} 