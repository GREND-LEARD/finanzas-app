import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedStatsCard({ 
  title, 
  value, 
  previousValue, 
  icon: Icon, 
  color = 'blue',
  percentChange = null,
  delay = 0
}) {
  const [counted, setCounted] = useState(0);
  
  // Determinar si el cambio es positivo o negativo
  const isPositive = percentChange > 0;
  const isNegative = percentChange < 0;
  
  // Mapear color a clases de Tailwind
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    primary: 'bg-[#00E676]/20 text-[#00E676] border-[#00E676]/30',
  }[color === 'primary' ? 'primary' : color];
  
  // Animar el valor de la estadística al cargar
  useEffect(() => {
    // Extraer el valor numérico de la cadena (por ejemplo, "$1,234.56" -> 1234.56)
    const numericValue = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
    
    let start = 0;
    // Encontrar un valor de inicio apropiado para la animación
    const end = numericValue;
    const duration = 1500; // duración en ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(end * progress);
      
      setCounted(currentCount);
      
      if (frame === totalFrames) {
        clearInterval(counter);
        setCounted(numericValue);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [value]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="relative overflow-hidden p-6 rounded-xl bg-gray-900/60 border border-gray-800 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
          <motion.div 
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {typeof value === 'string' ? value.replace(/[\d.,]/g, '') : ''}
            {counted.toLocaleString()}
          </motion.div>
          
          {percentChange !== null && (
            <motion.div 
              className={`mt-2 text-sm flex items-center ${isPositive ? 'text-[#00E676]' : isNegative ? 'text-red-400' : 'text-gray-400'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.4 }}
            >
              {isPositive && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              )}
              {isNegative && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0L12 8.414l-2.293 2.293A1 1 0 019 11V8a1 1 0 010-2h5z" clipRule="evenodd" />
                </svg>
              )}
              <span>{Math.abs(percentChange).toFixed(1)}% desde el último período</span>
            </motion.div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colorClasses}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
      
      {/* Barra de progreso animada en el fondo */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${color === 'primary' ? 'bg-[#00E676]' : color === 'red' ? 'bg-red-500' : color === 'green' ? 'bg-emerald-500' : 'bg-blue-500'}`}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
      />
    </motion.div>
  );
} 