'use client';

import React from 'react';
import { useNotificationStore, NOTIFICATION_TYPES } from '../../lib/store/notification-store';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaCoins, 
  FaBullseye, 
  FaExchangeAlt, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

export default function DemoNotifications() {
  const { 
    addNotification, 
    createBudgetAlert, 
    createGoalAlert, 
    createTransactionAlert,
    createReminder 
  } = useNotificationStore();
  
  // Generar una notificación básica
  const generateBasicNotification = (type) => {
    let title, message, importance;
    
    switch (type) {
      case 'success':
        title = '¡Operación exitosa!';
        message = 'La transacción ha sido procesada correctamente.';
        importance = NOTIFICATION_TYPES.SUCCESS;
        break;
      case 'warning':
        title = 'Advertencia';
        message = 'Verifica tus datos antes de continuar.';
        importance = NOTIFICATION_TYPES.WARNING;
        break;
      case 'error':
        title = 'Error';
        message = 'No se pudo completar la operación. Inténtalo de nuevo.';
        importance = NOTIFICATION_TYPES.ERROR;
        break;
      case 'info':
      default:
        title = 'Información';
        message = 'Recuerda actualizar tus datos financieros regularmente.';
        importance = NOTIFICATION_TYPES.INFO;
    }
    
    addNotification({
      title,
      message,
      type: importance,
      importance,
      temporary: false,
    });
  };
  
  // Generar una alerta de presupuesto
  const generateBudgetAlert = (percentage) => {
    createBudgetAlert(
      { id: 'budget-demo-1', name: 'Gastos mensuales' },
      percentage * 1000,
      1000
    );
  };
  
  // Generar una alerta de meta
  const generateGoalAlert = (percentage) => {
    createGoalAlert({
      id: 'goal-demo-1',
      name: 'Viaje de vacaciones',
      current_amount: percentage * 5000,
      target_amount: 5000
    });
  };
  
  // Generar una alerta de transacción inusual
  const generateTransactionAlert = () => {
    createTransactionAlert(
      {
        id: 'transaction-demo-1',
        description: 'Pago en tienda online',
        amount: 299.99
      },
      'Monto mayor al promedio de esta categoría'
    );
  };
  
  // Generar un recordatorio
  const generateReminder = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    
    createReminder(
      'Pago próximo',
      'Tienes un pago programado para el servicio de internet',
      today
    );
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaBell className="text-[#00E676]" /> Generar notificaciones de demostración
      </h2>
      
      <p className="text-gray-400 mb-6">
        Utiliza estos botones para generar diferentes tipos de notificaciones y ver cómo funcionan.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-[#00E676]">
          <h3 className="text-white font-medium mb-3">Notificaciones básicas</h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => generateBasicNotification('success')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-green-900 text-green-300 hover:bg-green-800 transition-colors text-sm"
            >
              <FaCheckCircle className="w-4 h-4" /> Éxito
            </button>
            <button 
              onClick={() => generateBasicNotification('info')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-blue-900 text-blue-300 hover:bg-blue-800 transition-colors text-sm"
            >
              <FaInfoCircle className="w-4 h-4" /> Info
            </button>
            <button 
              onClick={() => generateBasicNotification('warning')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-yellow-900 text-yellow-300 hover:bg-yellow-800 transition-colors text-sm"
            >
              <FaExclamationTriangle className="w-4 h-4" /> Alerta
            </button>
            <button 
              onClick={() => generateBasicNotification('error')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-red-900 text-red-300 hover:bg-red-800 transition-colors text-sm"
            >
              <FaExclamationTriangle className="w-4 h-4" /> Error
            </button>
          </div>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-purple-500">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <FaCoins className="text-purple-400 w-4 h-4" /> Alertas de presupuesto
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => generateBudgetAlert(0.5)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-700 text-[#00E676] hover:bg-gray-600 transition-colors text-sm"
            >
              50% del presupuesto
            </button>
            <button 
              onClick={() => generateBudgetAlert(0.85)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-700 text-yellow-300 hover:bg-gray-600 transition-colors text-sm"
            >
              85% del presupuesto
            </button>
            <button 
              onClick={() => generateBudgetAlert(1.2)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-700 text-red-300 hover:bg-gray-600 transition-colors text-sm"
            >
              Presupuesto excedido
            </button>
          </div>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-[#00E676]">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <FaBullseye className="text-[#00E676] w-4 h-4" /> Alertas de metas
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => generateGoalAlert(0.5)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-700 text-[#00E676] hover:bg-gray-600 transition-colors text-sm"
            >
              50% de la meta
            </button>
            <button 
              onClick={() => generateGoalAlert(0.9)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-700 text-[#00E676] hover:bg-gray-600 transition-colors text-sm"
            >
              90% de la meta
            </button>
            <button 
              onClick={() => generateGoalAlert(1)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-700 text-[#00E676] hover:bg-gray-600 transition-colors text-sm"
            >
              Meta completada
            </button>
          </div>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-orange-500">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <FaExchangeAlt className="text-orange-400 w-4 h-4" /> Otras alertas
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={generateTransactionAlert}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-700 text-orange-300 hover:bg-gray-600 transition-colors text-sm"
            >
              Transacción inusual
            </button>
            <button 
              onClick={generateReminder}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-700 text-blue-300 hover:bg-gray-600 transition-colors text-sm"
            >
              Recordatorio de pago
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Haz clic en el ícono de la campana en la barra de navegación para ver tus notificaciones.</p>
      </div>
    </motion.div>
  );
} 