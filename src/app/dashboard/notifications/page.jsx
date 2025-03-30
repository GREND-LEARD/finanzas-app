'use client';

import React, { useState, useEffect } from 'react';
import { useNotificationStore, NOTIFICATION_TYPES } from '../../../lib/store/notification-store';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaFilter, 
  FaTrash, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaMoneyBill,
  FaBullseye,
  FaExchangeAlt,
  FaCalendarAlt,
  FaSearch,
  FaCheck
} from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NotificationsPage() {
  const { 
    notifications, 
    markAsRead, 
    removeNotification, 
    markAllAsRead, 
    clearAllNotifications 
  } = useNotificationStore();
  
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    typeFilters: [],
    dateRange: {
      from: null,
      to: null,
    },
    readStatus: 'all', // 'all', 'read', 'unread'
  });
  
  // Efecto para filtrar notificaciones
  useEffect(() => {
    let result = [...notifications];
    
    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        notification => 
          notification.title.toLowerCase().includes(searchLower) ||
          notification.message.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por tipo
    if (filters.typeFilters.length > 0) {
      result = result.filter(
        notification => filters.typeFilters.includes(notification.type)
      );
    }
    
    // Filtrar por fecha
    if (filters.dateRange.from) {
      const fromDate = new Date(filters.dateRange.from);
      result = result.filter(
        notification => new Date(notification.timestamp) >= fromDate
      );
    }
    
    if (filters.dateRange.to) {
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Fin del día
      result = result.filter(
        notification => new Date(notification.timestamp) <= toDate
      );
    }
    
    // Filtrar por estado de lectura
    if (filters.readStatus === 'read') {
      result = result.filter(notification => notification.read);
    } else if (filters.readStatus === 'unread') {
      result = result.filter(notification => !notification.read);
    }
    
    setFilteredNotifications(result);
  }, [notifications, filters]);
  
  // Función para alternar filtros de tipo
  const toggleTypeFilter = (type) => {
    setFilters(prevFilters => {
      const currentFilters = [...prevFilters.typeFilters];
      if (currentFilters.includes(type)) {
        return {
          ...prevFilters,
          typeFilters: currentFilters.filter(t => t !== type)
        };
      } else {
        return {
          ...prevFilters,
          typeFilters: [...currentFilters, type]
        };
      }
    });
  };

  // Obtener el ícono para cada tipo de notificación
  const getNotificationIcon = (notification) => {
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

  // Obtener una etiqueta descriptiva para cada tipo de notificación
  const getTypeLabel = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.BUDGET:
        return 'Presupuesto';
      case NOTIFICATION_TYPES.GOAL:
        return 'Meta';
      case NOTIFICATION_TYPES.TRANSACTION:
        return 'Transacción';
      case NOTIFICATION_TYPES.SUCCESS:
        return 'Éxito';
      case NOTIFICATION_TYPES.WARNING:
        return 'Advertencia';
      case NOTIFICATION_TYPES.ERROR:
        return 'Error';
      case NOTIFICATION_TYPES.INFO:
        return 'Información';
      default:
        return 'General';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Centro de Notificaciones</h1>
        <p className="text-gray-400">Gestiona todas tus notificaciones y alertas financieras en un solo lugar.</p>
      </div>

      {/* Panel de acciones principales */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-[#00E676] bg-opacity-20 rounded-lg text-[#00E676]">
            <FaBell className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-white font-semibold">Todas tus notificaciones</h2>
            <p className="text-sm text-gray-400">
              {notifications.length} 
              {notifications.length !== 1 ? ' notificaciones' : ' notificación'} en total
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-[#00E676] bg-opacity-20 text-[#00E676] rounded-lg hover:bg-opacity-30 transition-colors"
          >
            <FaCheck className="w-4 h-4" />
            <span>Marcar todas como leídas</span>
          </button>
          
          <button 
            onClick={clearAllNotifications}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaTrash className="w-4 h-4" />
            <span>Eliminar todas</span>
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <FaFilter className="text-[#00E676]" /> Filtros
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Buscar</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                placeholder="Buscar notificaciones..."
                className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
            </div>
          </div>

          {/* Filtro de fechas */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Rango de fechas</label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={filters.dateRange.from || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    dateRange: {...filters.dateRange, from: e.target.value}
                  })}
                  className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                />
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={filters.dateRange.to || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    dateRange: {...filters.dateRange, to: e.target.value}
                  })}
                  className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                />
              </div>
            </div>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Estado</label>
            <select
              value={filters.readStatus}
              onChange={(e) => setFilters({...filters, readStatus: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
            >
              <option value="all">Todas</option>
              <option value="read">Leídas</option>
              <option value="unread">No leídas</option>
            </select>
          </div>
        </div>

        {/* Filtros por tipo */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-400 mb-3">Filtrar por tipo</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(NOTIFICATION_TYPES).map((type) => (
              <button
                key={type}
                onClick={() => toggleTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 ${
                  filters.typeFilters.includes(type)
                    ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {getTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {filteredNotifications.map(notification => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-5 hover:bg-gray-750 transition-colors ${
                  !notification.read ? 'bg-gray-750 bg-opacity-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    {getNotificationIcon(notification)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <h4 className="text-white font-medium">{notification.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          notification.type === NOTIFICATION_TYPES.BUDGET 
                            ? 'bg-purple-900 text-purple-300' 
                            : notification.type === NOTIFICATION_TYPES.GOAL
                              ? 'bg-green-900 text-green-300'
                              : notification.type === NOTIFICATION_TYPES.TRANSACTION
                                ? 'bg-orange-900 text-orange-300'
                                : 'bg-gray-700 text-gray-300'
                        }`}>
                          {getTypeLabel(notification.type)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(notification.timestamp), 'PPP', { locale: es })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mt-1 mb-3">{notification.message}</p>
                    
                    {notification.data && notification.type === NOTIFICATION_TYPES.BUDGET && (
                      <div className="mt-3 mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progreso</span>
                          <span>{notification.data.percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
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
                      </div>
                    )}
                    
                    {notification.data && notification.type === NOTIFICATION_TYPES.GOAL && (
                      <div className="mt-3 mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progreso</span>
                          <span>{notification.data.percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-[#00E676]"
                            style={{ width: `${Math.min(notification.data.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-2 gap-2">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="px-3 py-1.5 rounded text-xs bg-[#00E676] bg-opacity-20 text-[#00E676] hover:bg-opacity-30 transition-colors"
                        >
                          Marcar como leída
                        </button>
                      )}
                      
                      <button 
                        onClick={() => removeNotification(notification.id)}
                        className="px-3 py-1.5 rounded text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-red-400 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <FaBell className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No hay notificaciones</h3>
            <p className="text-gray-400">
              {notifications.length > 0 
                ? 'No hay notificaciones que coincidan con tus filtros de búsqueda.' 
                : 'No tienes notificaciones en este momento.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 