import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatea un número a moneda mexicana (o cualquier otra moneda)
export function formatCurrency(amount, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Formatea una fecha a un formato legible
export function formatDate(date, formatString = 'PPP') {
  if (!date) return '';
  
  // Si date es un string, lo convertimos a objeto Date
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  return format(dateObj, formatString, {
    locale: es,
  });
}

// Formatea una fecha para input de tipo date
export function formatDateForInput(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

// Devuelve un color según el tipo de transacción
export function getTransactionColor(type) {
  return type === 'income' ? 'green' : 'red';
}

// Formatea un porcentaje
export function formatPercentage(value, decimals = 2) {
  return `${(value * 100).toFixed(decimals)}%`;
} 