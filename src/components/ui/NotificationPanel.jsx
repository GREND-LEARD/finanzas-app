'use client';

import React, { useEffect, useRef } from 'react';
import { useNotificationStore, NOTIFICATION_TYPES } from '../../lib/store/notification-store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaCheck, 
  FaTrash, 
  FaBell, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaCheckCircle,
  FaMoneyBill,
  FaBullseye,
  FaExchangeAlt
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Componente para una notificación individual
const NotificationItem = ({ notification, onMarkAsRead, onRemove }) => {
  const getNotificationIcon = () => {
    switch (notification.importance) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <FaCheckCircle className="text-green-400" />;
      case NOTIFICATION_TYPES.WARNING:
        return <FaExclamationTriangle className="text-yellow-400" />;
      case NOTIFICATION_TYPES.ERROR:
        return <FaExclamationTriangle className="text-red-400" />;
      case NOTIFICATION_TYPES.INFO:
        return <FaInfoCircle className="text-blue-400" />;
      default:
        switch (notification.type) {
          case NOTIFICATION_TYPES.BUDGET:
            return <FaMoneyBill className="text-purple-400" />;
          case NOTIFICATION_TYPES.GOAL:
            return <FaBullseye className="text-[#00E676]" />;
          case NOTIFICATION_TYPES.TRANSACTION:
            return <FaExchangeAlt className="text-orange-400" />;
          default:
            return <FaBell className="text-gray-400" />;
        }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors ${
        !notification.read ? 'bg-gray-800 bg-opacity-60' : ''
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-1">
          {getNotificationIcon()}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h4 className="text-white font-medium">{notification.title}</h4>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(notification.timestamp), { 
                addSuffix: true,
                locale: es 
              })}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
          
          {notification.data && notification.type === NOTIFICATION_TYPES.BUDGET && (
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  notification.data.percentage >= 100 
                    ? 'bg-red-500' 
                    : notification.data.percentage >= 80 
                      ? 'bg-yellow-500' 
                      : 'bg-[#00E676]'
                }`}
                style={{ width: `${Math.min(notification.data.percentage, 100)}%` }}
              ></div>
            </div>
          )}
          
          {notification.data && notification.type === NOTIFICATION_TYPES.GOAL && (
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-[#00E676]"
                style={{ width: `${Math.min(notification.data.percentage, 100)}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end mt-2 gap-2">
        {!notification.read && (
          <button 
            onClick={() => onMarkAsRead(notification.id)}
            className="p-1.5 rounded-full text-xs bg-gray-700 text-[#00E676] hover:bg-gray-600 transition-colors"
            aria-label="Marcar como leída"
          >
            <FaCheck />
          </button>
        )}
        
        <button 
          onClick={() => onRemove(notification.id)}
          className="p-1.5 rounded-full text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-red-400 transition-colors"
          aria-label="Eliminar notificación"
        >
          <FaTrash />
        </button>
      </div>
    </motion.div>
  );
};

export default function NotificationPanel() {
  const { 
    notifications, 
    isOpen, 
    closeNotificationPanel, 
    markAsRead, 
    removeNotification, 
    markAllAsRead, 
    clearAllNotifications, 
    unreadCount 
  } = useNotificationStore();
  
  const panelRef = useRef(null);

  // Efecto para cerrar panel al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        closeNotificationPanel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeNotificationPanel]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={closeNotificationPanel}
            />
      
            {/* Panel deslizable */}
            <motion.div
              ref={panelRef}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-gray-900 shadow-lg z-50 flex flex-col"
            >
              {/* Cabecera */}
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <FaBell className="text-[#00E676]" /> Notificaciones
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </h3>
                </div>
                
                <button 
                  onClick={closeNotificationPanel}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Acciones */}
              <div className="p-3 border-b border-gray-700 flex justify-between">
                <button 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className={`text-xs px-3 py-1.5 rounded flex items-center gap-1.5 ${
                    unreadCount > 0 
                      ? 'bg-[#00E676] bg-opacity-20 text-[#00E676] hover:bg-opacity-30' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaCheck /> Marcar todas como leídas
                </button>
                
                <button 
                  onClick={clearAllNotifications}
                  disabled={notifications.length === 0}
                  className={`text-xs px-3 py-1.5 rounded flex items-center gap-1.5 ${
                    notifications.length > 0 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaTrash /> Eliminar todas
                </button>
              </div>
              
              {/* Lista de notificaciones */}
              <div className="flex-grow overflow-y-auto">
                <AnimatePresence>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onRemove={removeNotification}
                      />
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center"
                    >
                      <FaBell className="w-12 h-12 mb-4 opacity-20" />
                      <p className="mb-2">No tienes notificaciones</p>
                      <p className="text-sm">Las alertas importantes aparecerán aquí</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-700">
                <a 
                  href="/dashboard/notifications" 
                  className="block w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-center rounded-lg transition-colors"
                >
                  Ver todas las notificaciones
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 