'use client';

import React, { useState, useEffect } from 'react';
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
import { useSettingsStore } from '@/lib/store/settings-store';

// Lista de monedas disponibles
const CURRENCIES = [
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano (MXN)' },
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina (GBP)' },
  { code: 'JPY', symbol: '¥', name: 'Yen Japonés (JPY)' },
  { code: 'CAD', symbol: '$', name: 'Dólar Canadiense (CAD)' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano (COP)' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino (ARS)' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno (CLP)' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño (BRL)' },
];

// Lista de locales disponibles
const LOCALES = [
  { code: 'es-MX', name: 'Español (México)' },
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'es-CO', name: 'Español (Colombia)' },
  { code: 'es-AR', name: 'Español (Argentina)' },
  { code: 'en-US', name: 'Inglés (Estados Unidos)' },
  { code: 'en-GB', name: 'Inglés (Reino Unido)' },
  { code: 'fr-FR', name: 'Francés' },
  { code: 'de-DE', name: 'Alemán' },
  { code: 'pt-BR', name: 'Portugués (Brasil)' },
];

/**
 * Página de configuraciones de la aplicación
 */
export default function SettingsPage() {
  // Obtener configuración del store
  const {
    currency,
    locale,
    theme,
    weekStartDay,
    setCurrency,
    setLocale,
    setTheme,
    setWeekStartDay
  } = useSettingsStore();
  
  // Estado para controlar el dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocaleDropdownOpen, setIsLocaleDropdownOpen] = useState(false);
  
  // Función para seleccionar moneda
  const handleCurrencySelect = (currencyCode, currencySymbol) => {
    setCurrency(currencyCode, currencySymbol);
    setIsDropdownOpen(false);
  };
  
  // Función para seleccionar locale
  const handleLocaleSelect = (localeCode) => {
    setLocale(localeCode);
    setIsLocaleDropdownOpen(false);
  };
  
  // Obtener el nombre de la moneda seleccionada
  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const selectedLocale = LOCALES.find(l => l.code === locale) || LOCALES[0];
  
  // Garantizar que siempre tengamos un código de moneda válido
  const safeCurrentCurrency = currency || 'MXN';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Configuración</h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">Personaliza la aplicación según tus preferencias</p>
      
      <div className="grid gap-8">
        {/* Sección de configuración general */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Configuración General</h2>
          
          {/* Selector de Moneda */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Moneda</label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="flex items-center">
                  <span className="text-lg mr-2">{selectedCurrency.symbol}</span>
                  <span>{selectedCurrency.name}</span>
                </span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => handleCurrencySelect(curr.code, curr.symbol)}
                      className={`w-full text-left flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        currency === curr.code ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}
                    >
                      <span className="text-lg mr-2">{curr.symbol}</span>
                      <span>{curr.name}</span>
                      {currency === curr.code && (
                        <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Selector de Formato Regional */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Formato Regional</label>
            <div className="relative">
              <button
                onClick={() => setIsLocaleDropdownOpen(!isLocaleDropdownOpen)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>{selectedLocale.name}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isLocaleDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => handleLocaleSelect(loc.code)}
                      className={`w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        locale === loc.code ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}
                    >
                      {loc.name}
                      {locale === loc.code && (
                        <svg className="w-5 h-5 ml-auto inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Selector de Tema */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tema</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <span className="text-2xl mb-2">🌙</span>
                <span className="font-medium">Oscuro</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  El tema oscuro se utilizará por defecto.
                </span>
              </button>
              
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                  theme === 'light' 
                    ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <span className="text-2xl mb-2">☀️</span>
                <span className="font-medium">Claro</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  El tema claro se utilizará por defecto.
                </span>
              </button>
            </div>
          </div>
          
          {/* Día de inicio de semana */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Día de inicio de semana</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setWeekStartDay('monday')}
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  weekStartDay === 'monday' 
                    ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <span className="font-medium">Lunes</span>
              </button>
              
              <button
                onClick={() => setWeekStartDay('sunday')}
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  weekStartDay === 'sunday' 
                    ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <span className="font-medium">Domingo</span>
              </button>
            </div>
          </div>
        </section>
        
        {/* Sección de previsualización */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Previsualización de Configuración</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Moneda</h3>
              <div className="flex gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  {new Intl.NumberFormat(locale || 'es-MX', { style: 'currency', currency: safeCurrentCurrency }).format(1234.56)}
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  {new Intl.NumberFormat(locale || 'es-MX', { style: 'currency', currency: safeCurrentCurrency }).format(9876.54)}
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Formato de Fecha</h3>
              <div className="flex gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  {new Date().toLocaleDateString(locale || 'es-MX', { dateStyle: 'full' })}
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Formato Numérico</h3>
              <div className="flex gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  {new Intl.NumberFormat(locale || 'es-MX').format(1234567.89)}
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Formato de Porcentaje</h3>
              <div className="flex gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  {new Intl.NumberFormat(locale || 'es-MX', { style: 'percent' }).format(0.1234)}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 