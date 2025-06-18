import { create } from 'zustand';

// Clave para almacenar configuración en localStorage
const STORAGE_KEY = 'finanzas-app-settings';

// Valores predeterminados
const defaultSettings = {
  // Configuración de moneda
  currency: 'MXN',
  currencySymbol: '$',
  
  // Configuración de tema
  theme: 'dark',
  
  // Configuración de formato de fecha
  dateFormat: 'DD/MM/YYYY',
  weekStartDay: 'monday',
  
  // Configuración de locale
  locale: 'es-MX',
};

// Función para cargar la configuración desde localStorage
const loadSettings = () => {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  } catch (error) {
    console.error('Error al cargar configuración:', error);
    return defaultSettings;
  }
};

// Función para guardar la configuración en localStorage
const saveSettings = (settings) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error al guardar configuración:', error);
  }
};

/**
 * Store para manejar las configuraciones de la aplicación
 * Persiste las preferencias del usuario en localStorage
 */
export const useSettingsStore = create((set) => ({
  ...loadSettings(),
  
  /**
   * Actualiza la moneda seleccionada
   * @param {string} currency - Código de la moneda (MXN, USD, EUR, etc)
   * @param {string} symbol - Símbolo de la moneda ($, €, etc)
   */
  setCurrency: (currency, symbol) => {
    set((state) => {
      const newState = { ...state, currency, currencySymbol: symbol };
      saveSettings(newState);
      return newState;
    });
  },
  
  /**
   * Actualiza el tema de la aplicación
   * @param {string} theme - Tema seleccionado ('dark' o 'light')
   */
  setTheme: (theme) => {
    set((state) => {
      const newState = { ...state, theme };
      saveSettings(newState);
      
      // Aplicar el tema en el documento HTML
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
      
      return newState;
    });
  },
  
  /**
   * Actualiza el día de inicio de semana
   * @param {string} day - Día de inicio ('monday' o 'sunday')
   */
  setWeekStartDay: (day) => {
    set((state) => {
      const newState = { ...state, weekStartDay: day };
      saveSettings(newState);
      return newState;
    });
  },
  
  /**
   * Actualiza el formato de fecha
   * @param {string} format - Formato de fecha
   */
  setDateFormat: (format) => {
    set((state) => {
      const newState = { ...state, dateFormat: format };
      saveSettings(newState);
      return newState;
    });
  },
  
  /**
   * Actualiza la configuración regional
   * @param {string} locale - Código de locale (es-MX, en-US, etc)
   */
  setLocale: (locale) => {
    set((state) => {
      const newState = { ...state, locale };
      saveSettings(newState);
      return newState;
    });
  }
})); 