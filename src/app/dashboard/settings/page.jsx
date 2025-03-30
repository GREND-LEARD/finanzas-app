'use client';

import React, { useState } from 'react';
import { 
  FaCog, 
  FaUser, 
  FaLock, 
  FaBell, 
  FaPalette, 
  FaDownload, 
  FaTrash, 
  FaGlobe,
  FaDollarSign,
  FaCheck,
  FaMoon,
  FaSun,
  FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Opciones para configuración de moneda
const CURRENCY_OPTIONS = [
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
  { code: 'JPY', symbol: '¥', name: 'Yen Japonés' },
  { code: 'CAD', symbol: '$', name: 'Dólar Canadiense' },
  { code: 'AUD', symbol: '$', name: 'Dólar Australiano' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno' },
  { code: 'PEN', symbol: 'S/', name: 'Sol Peruano' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño' },
  { code: 'BOB', symbol: 'Bs.', name: 'Boliviano' },
];

// Opciones para formato de fecha
const DATE_FORMAT_OPTIONS = [
  { id: 'DD/MM/YYYY', name: 'DD/MM/YYYY', example: '31/12/2023' },
  { id: 'MM/DD/YYYY', name: 'MM/DD/YYYY', example: '12/31/2023' },
  { id: 'YYYY-MM-DD', name: 'YYYY-MM-DD', example: '2023-12-31' },
  { id: 'DD.MM.YYYY', name: 'DD.MM.YYYY', example: '31.12.2023' },
];

export default function SettingsPage() {
  // Estado para las diferentes configuraciones
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    currency: 'MXN',
    dateFormat: 'DD/MM/YYYY',
    theme: 'dark',
    language: 'es',
    startDayOfWeek: 'monday'
  });
  
  const [accountSettings, setAccountSettings] = useState({
    name: 'Usuario Demo',
    email: 'usuario@ejemplo.com',
    avatar: null
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    goalAchieved: true,
    weeklyReport: true,
    transactionConfirmation: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    shareDataForImprovement: true,
    allowAnalytics: true,
    storeTransactionDetails: true
  });
  
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showDateFormatSelector, setShowDateFormatSelector] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  // Función para actualizar configuraciones generales
  const handleGeneralSettingChange = (setting, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Función para actualizar configuraciones de notificaciones
  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Función para actualizar configuraciones de privacidad
  const handlePrivacyChange = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Simulación de exportación de datos
  const handleExportData = () => {
    alert('Tus datos se exportarán en formato CSV. Esta es una funcionalidad simulada.');
  };
  
  // Simulación de eliminación de cuenta
  const handleDeleteAccount = () => {
    alert('Esta es una funcionalidad simulada. En una implementación real, tu cuenta sería eliminada permanentemente.');
    setShowDeleteConfirmation(false);
  };
  
  // Renderizar el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Configuración General</h2>
            
            {/* Moneda */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-md">
              <h3 className="text-white font-medium mb-4">Moneda</h3>
              
              <div className="relative">
                <button 
                  onClick={() => setShowCurrencySelector(!showCurrencySelector)}
                  className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-lg text-white hover:bg-gray-650 transition-colors"
                >
                  <div className="flex items-center">
                    <FaDollarSign className="mr-2 text-[#00E676]" />
                    <span>
                      {CURRENCY_OPTIONS.find(c => c.code === generalSettings.currency)?.symbol} 
                      {' '}
                      {CURRENCY_OPTIONS.find(c => c.code === generalSettings.currency)?.name}
                    </span>
                  </div>
                  <FaChevronRight className={`transition-transform ${showCurrencySelector ? 'rotate-90' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showCurrencySelector && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-full bg-gray-750 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto"
                    >
                      {CURRENCY_OPTIONS.map(currency => (
                        <button
                          key={currency.code}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center justify-between ${
                            currency.code === generalSettings.currency ? 'text-[#00E676]' : 'text-white'
                          }`}
                          onClick={() => {
                            handleGeneralSettingChange('currency', currency.code);
                            setShowCurrencySelector(false);
                          }}
                        >
                          <span>
                            {currency.symbol} {currency.name} ({currency.code})
                          </span>
                          {currency.code === generalSettings.currency && <FaCheck />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Formato de fecha */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-md">
              <h3 className="text-white font-medium mb-4">Formato de Fecha</h3>
              
              <div className="relative">
                <button 
                  onClick={() => setShowDateFormatSelector(!showDateFormatSelector)}
                  className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-lg text-white hover:bg-gray-650 transition-colors"
                >
                  <div className="flex items-center">
                    <FaGlobe className="mr-2 text-[#00E676]" />
                    <span>
                      {DATE_FORMAT_OPTIONS.find(d => d.id === generalSettings.dateFormat)?.name} 
                      {' '}
                      <span className="text-gray-400">
                        (Ej. {DATE_FORMAT_OPTIONS.find(d => d.id === generalSettings.dateFormat)?.example})
                      </span>
                    </span>
                  </div>
                  <FaChevronRight className={`transition-transform ${showDateFormatSelector ? 'rotate-90' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showDateFormatSelector && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-full bg-gray-750 rounded-lg shadow-lg border border-gray-700"
                    >
                      {DATE_FORMAT_OPTIONS.map(format => (
                        <button
                          key={format.id}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center justify-between ${
                            format.id === generalSettings.dateFormat ? 'text-[#00E676]' : 'text-white'
                          }`}
                          onClick={() => {
                            handleGeneralSettingChange('dateFormat', format.id);
                            setShowDateFormatSelector(false);
                          }}
                        >
                          <span>
                            {format.name} <span className="text-gray-400">(Ej. {format.example})</span>
                          </span>
                          {format.id === generalSettings.dateFormat && <FaCheck />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Tema */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-md">
              <h3 className="text-white font-medium mb-4">Tema</h3>
              
              <div className="flex gap-4">
                <button
                  className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-3 border-2 transition-colors ${
                    generalSettings.theme === 'dark' 
                      ? 'border-[#00E676] bg-gray-700' 
                      : 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                  }`}
                  onClick={() => handleGeneralSettingChange('theme', 'dark')}
                >
                  <FaMoon className={generalSettings.theme === 'dark' ? 'text-[#00E676]' : 'text-gray-400'} size={24} />
                  <span className={generalSettings.theme === 'dark' ? 'text-white' : 'text-gray-400'}>Oscuro</span>
                </button>
                
                <button
                  className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-3 border-2 transition-colors ${
                    generalSettings.theme === 'light' 
                      ? 'border-[#00E676] bg-gray-700' 
                      : 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                  }`}
                  onClick={() => handleGeneralSettingChange('theme', 'light')}
                >
                  <FaSun className={generalSettings.theme === 'light' ? 'text-[#00E676]' : 'text-gray-400'} size={24} />
                  <span className={generalSettings.theme === 'light' ? 'text-white' : 'text-gray-400'}>Claro</span>
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-400">El tema oscuro se utilizará por defecto.</p>
            </div>
            
            {/* Día de inicio de semana */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-md">
              <h3 className="text-white font-medium mb-4">Día de inicio de semana</h3>
              
              <div className="flex gap-4">
                <button
                  className={`flex-1 py-3 rounded-lg text-center transition-colors ${
                    generalSettings.startDayOfWeek === 'monday' 
                      ? 'bg-[#00E676] bg-opacity-20 text-[#00E676] font-medium' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
                  }`}
                  onClick={() => handleGeneralSettingChange('startDayOfWeek', 'monday')}
                >
                  Lunes
                </button>
                
                <button
                  className={`flex-1 py-3 rounded-lg text-center transition-colors ${
                    generalSettings.startDayOfWeek === 'sunday' 
                      ? 'bg-[#00E676] bg-opacity-20 text-[#00E676] font-medium' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
                  }`}
                  onClick={() => handleGeneralSettingChange('startDayOfWeek', 'sunday')}
                >
                  Domingo
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Notificaciones</h2>
            
            <div className="bg-gray-800 rounded-lg p-4 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Notificaciones por correo</h3>
                  <p className="text-sm text-gray-400">Recibe actualizaciones importantes por correo electrónico</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E676]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Alertas de presupuesto</h3>
                  <p className="text-sm text-gray-400">Notificaciones cuando te acerques o superes tus límites de presupuesto</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.budgetAlerts}
                    onChange={() => handleNotificationChange('budgetAlerts')}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E676]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Metas alcanzadas</h3>
                  <p className="text-sm text-gray-400">Notificaciones cuando completes una meta financiera</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.goalAchieved}
                    onChange={() => handleNotificationChange('goalAchieved')}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E676]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Reporte semanal</h3>
                  <p className="text-sm text-gray-400">Recibe un resumen semanal de tus finanzas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.weeklyReport}
                    onChange={() => handleNotificationChange('weeklyReport')}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E676]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Confirmación de transacciones</h3>
                  <p className="text-sm text-gray-400">Recibe confirmaciones por cada transacción registrada</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.transactionConfirmation}
                    onChange={() => handleNotificationChange('transactionConfirmation')}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E676]"></div>
                </label>
              </div>
            </div>
          </div>
        );
        
      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Privacidad y Datos</h2>
            
            <div className="bg-gray-800 rounded-lg p-4 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Compartir datos para mejorar la aplicación</h3>
                  <p className="text-sm text-gray-400">Ayúdanos a mejorar compartiendo datos anónimos de uso</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={privacySettings.shareDataForImprovement}
                    onChange={() => handlePrivacyChange('shareDataForImprovement')}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E676]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Permitir análisis estadístico</h3>
                  <p className="text-sm text-gray-400">Permite análisis anónimo para mejorar funcionalidades</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={privacySettings.allowAnalytics}
                    onChange={() => handlePrivacyChange('allowAnalytics')}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E676]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Guardar detalles de transacciones</h3>
                  <p className="text-sm text-gray-400">Almacenar detalles completos de todas las transacciones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={privacySettings.storeTransactionDetails}
                    onChange={() => handlePrivacyChange('storeTransactionDetails')}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E676]"></div>
                </label>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 shadow-md space-y-4">
              <h3 className="text-white font-medium">Exportar mis datos</h3>
              <p className="text-sm text-gray-400">
                Descarga toda tu información personal y financiera en formato CSV
              </p>
              <button 
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaDownload /> Exportar mis datos
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 shadow-md space-y-4">
              <h3 className="text-white font-medium">Eliminar mi cuenta</h3>
              <p className="text-sm text-gray-400">
                Esta acción eliminará permanentemente tu cuenta y todos tus datos. No podrás recuperarlos después.
              </p>
              <button 
                onClick={() => setShowDeleteConfirmation(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaTrash /> Eliminar mi cuenta
              </button>
            </div>
            
            {/* Modal de confirmación para eliminar cuenta */}
            <AnimatePresence>
              {showDeleteConfirmation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">¿Estás seguro?</h3>
                    <p className="text-gray-300 mb-6">
                      Esta acción eliminará permanentemente tu cuenta y todos tus datos. No podrás recuperarlos después.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowDeleteConfirmation(false)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <FaTrash className="w-4 h-4" /> Eliminar permanentemente
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
        
      case 'account':
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Perfil y Cuenta</h2>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold text-[#00E676]">
                  {accountSettings.name.charAt(0)}
                </div>
                
                <div className="flex-grow">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={accountSettings.name}
                      onChange={(e) => setAccountSettings({...accountSettings, name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <button className="w-full bg-[#00E676] text-gray-900 font-medium py-2 rounded-lg hover:bg-[#00E676]/90 transition-colors">
                  Guardar cambios
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-white font-medium mb-4">Cambiar contraseña</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                  />
                </div>
                
                <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                  Actualizar contraseña
                </button>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
        <p className="text-gray-400">Personaliza la aplicación según tus preferencias</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Menú lateral */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-white font-medium flex items-center gap-2">
                <FaCog className="text-[#00E676]" /> Opciones
              </h2>
            </div>
            
            <nav className="p-2">
              <button
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === 'account' 
                    ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setActiveTab('account')}
              >
                <FaUser className="w-5 h-5" /> Perfil y Cuenta
              </button>
              
              <button
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === 'general' 
                    ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setActiveTab('general')}
              >
                <FaPalette className="w-5 h-5" /> General
              </button>
              
              <button
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === 'notifications' 
                    ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell className="w-5 h-5" /> Notificaciones
              </button>
              
              <button
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === 'privacy' 
                    ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setActiveTab('privacy')}
              >
                <FaLock className="w-5 h-5" /> Privacidad y Datos
              </button>
            </nav>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="md:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 