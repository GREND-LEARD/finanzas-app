'use client';

import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Lista de iconos comunes para finanzas
const COMMON_ICONS = [
  'FaHome', 'FaCar', 'FaUtensils', 'FaShoppingBag', 'FaGraduationCap', 
  'FaHeartbeat', 'FaPlane', 'FaBus', 'FaTaxi', 'FaShoppingCart',
  'FaCoffee', 'FaGamepad', 'FaFilm', 'FaGift', 'FaBolt',
  'FaWifi', 'FaTshirt', 'FaPizzaSlice', 'FaMoneyBillWave', 'FaLaptopCode',
  'FaBriefcase', 'FaBaby', 'FaDog', 'FaBrain', 'FaTools',
  'FaGuitar', 'FaDumbbell', 'FaBookOpen', 'FaGasPump', 'FaRegCreditCard',
  'FaBuilding', 'FaUniversity', 'FaChartLine', 'FaHandHoldingUsd', 'FaSuitcase',
  'FaUmbrella', 'FaMobile', 'FaTags', 'FaBank'
];

// Función que convierte el nombre del icono a un componente
const getIconComponent = (iconName, props = {}) => {
  const IconComponent = FaIcons[iconName];
  return IconComponent ? <IconComponent {...props} /> : <FaIcons.FaQuestion />;
};

export default function IconSelector({ selected, onSelect, readOnly = false, color = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Si es de solo lectura, solo mostrar el icono seleccionado
  if (readOnly) {
    return getIconComponent(selected, { className: 'w-5 h-5', style: color ? { color } : {} });
  }
  
  // Filtrar iconos según el término de búsqueda
  const filteredIcons = searchTerm
    ? Object.keys(FaIcons)
        .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 50) // Limitar para mejor rendimiento
    : COMMON_ICONS;
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          {getIconComponent(selected, { className: 'w-5 h-5 text-[#00E676]' })}
          <span className="text-gray-300">{selected}</span>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 max-h-80 overflow-y-auto">
          <div className="mb-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar iconos..."
              className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00E676] focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {filteredIcons.map(iconName => (
              <button
                key={iconName}
                type="button"
                onClick={() => {
                  onSelect(iconName);
                  setIsOpen(false);
                }}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                  selected === iconName
                    ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                title={iconName}
              >
                {getIconComponent(iconName, { className: 'w-5 h-5' })}
              </button>
            ))}
            
            {filteredIcons.length === 0 && (
              <div className="col-span-6 py-4 text-center text-gray-400">
                No se encontraron iconos con "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 