'use client';

import React from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotificationStore } from '../../lib/store/notification-store';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBadge() {
  const { unreadCount, toggleNotificationPanel, isOpen } = useNotificationStore();
  
  return (
    <button 
      onClick={toggleNotificationPanel}
      className={`relative p-2 rounded-full transition-colors ${
        isOpen 
          ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]' 
          : 'text-gray-300 hover:text-white hover:bg-gray-700'
      }`}
      aria-label="Notificaciones"
    >
      <FaBell className="w-5 h-5" />
      
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            style={{ 
              minWidth: '18px', 
              height: '18px',
              padding: unreadCount > 9 ? '0 4px' : '0'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
} 