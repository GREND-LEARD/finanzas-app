import React from 'react';
import { motion } from 'framer-motion';
import StatCard from './StatCard';

// Datos de ejemplo para los gráficos
const generateRandomData = (length, min, max, increasing = true) => {
  let lastValue = min + Math.floor(Math.random() * (max - min));
  
  return Array.from({ length }, (_, i) => {
    const randomChange = Math.floor(Math.random() * 15);
    if (increasing) {
      lastValue = Math.min(max, lastValue + randomChange);
    } else {
      // Para datos con tendencia bajista, aumentamos la probabilidad de bajar
      const goesUp = Math.random() > 0.7;
      lastValue = Math.max(min, Math.min(max, lastValue + (goesUp ? randomChange : -randomChange)));
    }
    return {
      name: i.toString(),
      value: lastValue
    };
  });
};

export default function StatsSection() {
  const transactionsData = generateRandomData(7, 40, 90, true);
  const savingsData = generateRandomData(7, 50, 100, true);
  const expensesData = generateRandomData(7, 30, 80, false);
  const budgetsData = generateRandomData(7, 20, 70, true);
  
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-base font-semibold text-[#00E676] tracking-wide uppercase">
            Estadísticas
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            La mejor forma de controlar tus finanzas
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
            Visualiza el estado de tus finanzas en tiempo real con nuestros paneles personalizados
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <StatCard 
              title="Transacciones Mensuales" 
              value="125" 
              change="12.5" 
              isPositive={true}
              data={transactionsData}
              chartType="line"
              accentColor="#00E676"
              bgColor="bg-gray-800"
              borderColor="border-gray-700"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatCard 
              title="Ahorro Total" 
              value="$2,540" 
              change="8.2" 
              isPositive={true}
              data={savingsData}
              chartType="area"
              accentColor="#64B5F6"
              bgColor="bg-gray-800"
              borderColor="border-gray-700"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatCard 
              title="Gastos Semanales" 
              value="$450" 
              change="3.1" 
              isPositive={false}
              data={expensesData}
              chartType="line"
              accentColor="#FF5252"
              bgColor="bg-gray-800"
              borderColor="border-gray-700"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatCard 
              title="Presupuestos Activos" 
              value="8" 
              change="25" 
              isPositive={true}
              data={budgetsData}
              chartType="area"
              accentColor="#FFD54F"
              bgColor="bg-gray-800"
              borderColor="border-gray-700"
            />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-300">
            Obtén acceso a más estadísticas detalladas con nuestra versión premium
          </p>
        </motion.div>
      </div>
    </section>
  );
}
