import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSettingsStore } from '@/lib/store/settings-store';

/**
 * Utilidades para formateo de datos en la aplicación
 */

/**
 * Formatea un número a moneda con la configuración del usuario
 * @param {number} amount - Cantidad a formatear
 * @param {string} [customCurrency] - Opcional: Moneda personalizada para este formato específico
 * @param {string} [customLocale] - Opcional: Locale personalizado para este formato específico
 * @returns {string} Cantidad formateada como moneda
 */
export function formatCurrency(amount, customCurrency, customLocale) {
  // Obtener configuración del usuario (solo funciona en componentes de React)
  const getSettings = () => {
    try {
      return useSettingsStore.getState();
    } catch (e) {
      // Si no estamos en un componente React, usamos valores predeterminados
      return {
        currency: 'MXN',
        locale: 'es-MX'
      };
    }
  };

  const settings = getSettings();
  // Asegurarnos de que siempre tenemos un código de moneda válido
  const currency = customCurrency || settings.currency || 'MXN';
  const locale = customLocale || settings.locale || 'es-MX';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * Formatea una fecha a formato local legible según la configuración del usuario
 * @param {Date|string} date - Fecha a formatear
 * @param {object} [options] - Opciones de formato
 * @param {string} [customLocale] - Opcional: Locale personalizado para este formato específico
 * @returns {string} Fecha formateada
 */
export function formatDate(date, options = {}, customLocale) {
  if (!date) return '';
  
  const getLocale = () => {
    try {
      return customLocale || useSettingsStore.getState().locale || 'es-MX';
    } catch (e) {
      return 'es-MX';
    }
  };
  
  const locale = getLocale();
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Formatea una fecha en formato corto según la configuración del usuario
 * @param {Date|string} date - Fecha a formatear
 * @param {string} [customLocale] - Opcional: Locale personalizado para este formato específico
 * @returns {string} Fecha en formato corto
 */
export function formatShortDate(date, customLocale) {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }, customLocale);
}

/**
 * Formatea un número con separadores de miles según la configuración del usuario
 * @param {number} number - Número a formatear
 * @param {string} [customLocale] - Opcional: Locale personalizado para este formato específico
 * @returns {string} Número formateado
 */
export function formatNumber(number, customLocale) {
  const getLocale = () => {
    try {
      return customLocale || useSettingsStore.getState().locale || 'es-MX';
    } catch (e) {
      return 'es-MX';
    }
  };
  
  return new Intl.NumberFormat(getLocale()).format(number || 0);
}

/**
 * Formatea un porcentaje según la configuración del usuario
 * @param {number} value - Valor a formatear como porcentaje (0-100)
 * @param {string} [customLocale] - Opcional: Locale personalizado para este formato específico
 * @returns {string} Porcentaje formateado
 */
export function formatPercent(value, customLocale) {
  const getLocale = () => {
    try {
      return customLocale || useSettingsStore.getState().locale || 'es-MX';
    } catch (e) {
      return 'es-MX';
    }
  };
  
  return new Intl.NumberFormat(getLocale(), {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

/**
 * Calcula y formatea la diferencia entre dos valores como porcentaje
 * @param {number} current - Valor actual
 * @param {number} previous - Valor anterior
 * @param {string} [customLocale] - Opcional: Locale personalizado para este formato específico
 * @returns {string} Diferencia porcentual formateada con signo
 */
export function formatPercentChange(current, previous, customLocale) {
  if (!previous) return '+0.0%';
  
  const percentChange = ((current - previous) / Math.abs(previous)) * 100;
  const sign = percentChange > 0 ? '+' : '';
  
  const getLocale = () => {
    try {
      return customLocale || useSettingsStore.getState().locale || 'es-MX';
    } catch (e) {
      return 'es-MX';
    }
  };
  
  return sign + new Intl.NumberFormat(getLocale(), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percentChange) + '%';
}

// Formatea una fecha para input de tipo date
export function formatDateForInput(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * Obtiene color para transacciones por tipo
 * @param {string} type - Tipo de transacción ('income' o 'gasto')
 * @returns {string} Color CSS
 */
export function getTransactionColor(type) {
  return type === 'income' ? 'green' : 'red';
} 