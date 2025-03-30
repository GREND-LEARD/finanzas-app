'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPalette, FaSearch, FaTags } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import IconSelector from '../../../components/forms/IconSelector';

// Datos de ejemplo para categorías
const SAMPLE_CATEGORIES = [
  { id: '1', name: 'Alimentación', type: 'expense', color: '#FF5252', icon: 'FaUtensils', description: 'Supermercado, restaurantes y comida para llevar' },
  { id: '2', name: 'Transporte', type: 'expense', color: '#FFA726', icon: 'FaCar', description: 'Gasolina, transporte público y mantenimiento de vehículos' },
  { id: '3', name: 'Vivienda', type: 'expense', color: '#42A5F5', icon: 'FaHome', description: 'Alquiler, hipoteca y servicios domésticos' },
  { id: '4', name: 'Entretenimiento', type: 'expense', color: '#9C27B0', icon: 'FaFilm', description: 'Cine, conciertos, suscripciones y salidas' },
  { id: '5', name: 'Salud', type: 'expense', color: '#26A69A', icon: 'FaHeartbeat', description: 'Médicos, medicamentos y seguros de salud' },
  { id: '6', name: 'Educación', type: 'expense', color: '#5C6BC0', icon: 'FaGraduationCap', description: 'Cursos, libros y material educativo' },
  { id: '7', name: 'Servicios', type: 'expense', color: '#78909C', icon: 'FaBolt', description: 'Luz, agua, internet y suscripciones' },
  { id: '8', name: 'Salario', type: 'income', color: '#66BB6A', icon: 'FaMoneyBillWave', description: 'Ingresos por trabajo en relación de dependencia' },
  { id: '9', name: 'Freelance', type: 'income', color: '#26C6DA', icon: 'FaLaptopCode', description: 'Ingresos por trabajo independiente' },
  { id: '10', name: 'Inversiones', type: 'income', color: '#9CCC65', icon: 'FaChartLine', description: 'Dividendos, intereses y ganancias de capital' },
  { id: '11', name: 'Regalos', type: 'income', color: '#EC407A', icon: 'FaGift', description: 'Dinero recibido como regalo o donación' },
];

// Paleta de colores sugeridos
const COLOR_PALETTE = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', 
  '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40', '#8D6E63', '#78909C',
  '#26A69A', '#66BB6A', '#9CCC65', '#00E676', '#FFC107', '#FF9800'
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  
  // Formulario
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#00E676',
    icon: 'FaTags',
    description: ''
  });
  
  // Filtrar categorías según la búsqueda y el tipo
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || category.type === filterType;
    return matchesSearch && matchesType;
  });
  
  // Agrupar categorías por tipo para visualización
  const groupedCategories = {
    income: filteredCategories.filter(cat => cat.type === 'income'),
    expense: filteredCategories.filter(cat => cat.type === 'expense')
  };
  
  // Función para abrir el formulario en modo creación
  const handleCreateCategory = () => {
    setFormData({
      name: '',
      type: 'expense',
      color: '#00E676',
      icon: 'FaTags',
      description: ''
    });
    setFormMode('create');
    setIsFormOpen(true);
  };
  
  // Función para abrir el formulario en modo edición
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      description: category.description
    });
    setFormMode('edit');
    setIsFormOpen(true);
  };
  
  // Función para guardar los cambios (crear o actualizar)
  const handleSaveCategory = (e) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      // Crear nueva categoría
      const newCategory = {
        ...formData,
        id: Date.now().toString()  // Generar un ID único
      };
      setCategories([...categories, newCategory]);
    } else {
      // Actualizar categoría existente
      setCategories(categories.map(cat => 
        cat.id === formData.id ? { ...formData } : cat
      ));
    }
    
    // Cerrar formulario y limpiar estado
    setIsFormOpen(false);
    setSelectedCategory(null);
  };
  
  // Función para eliminar una categoría
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría? Las transacciones asociadas no se eliminarán, pero perderán su categorización.')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };
  
  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Categorías</h1>
        <p className="text-gray-400">Personaliza las categorías para tus ingresos y gastos.</p>
      </div>
      
      {/* Panel de acciones */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#00E676] bg-opacity-20 rounded-lg text-[#00E676]">
              <FaTags className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-white font-semibold">Categorías personalizadas</h2>
              <p className="text-sm text-gray-400">
                {categories.length} categorías en total ({groupedCategories.income.length} de ingresos, {groupedCategories.expense.length} de gastos)
              </p>
            </div>
          </div>
          
          <div>
            <button
              onClick={handleCreateCategory}
              className="flex items-center gap-2 px-4 py-2 bg-[#00E676] text-gray-900 rounded-lg hover:bg-[#00E676]/90 transition-colors font-medium"
            >
              <FaPlus className="w-4 h-4" />
              <span>Nueva Categoría</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[280px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar categorías..."
              className="pl-10 w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex bg-gray-800 rounded-lg border border-gray-700 p-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1 rounded-md transition-colors ${
              filterType === 'all' 
                ? 'bg-[#00E676] text-gray-900 font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-4 py-1 rounded-md transition-colors ${
              filterType === 'income' 
                ? 'bg-[#00E676] text-gray-900 font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-4 py-1 rounded-md transition-colors ${
              filterType === 'expense' 
                ? 'bg-[#00E676] text-gray-900 font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Gastos
          </button>
        </div>
      </div>
      
      {/* Formulario para crear/editar categorías */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {formMode === 'create' ? 'Crear nueva categoría' : 'Editar categoría'}
            </h3>
            
            <form onSubmit={handleSaveCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                    placeholder="Ej. Alimentación, Transporte, Salario..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tipo
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                  >
                    <option value="expense">Gasto</option>
                    <option value="income">Ingreso</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleFormChange}
                      className="h-10 w-10 rounded border-0 bg-transparent"
                    />
                    <div className="ml-4 flex flex-wrap gap-2">
                      {COLOR_PALETTE.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-6 h-6 rounded-full border-2 ${
                            formData.color === color ? 'border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Ícono
                  </label>
                  <div className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white">
                    <IconSelector 
                      selected={formData.icon} 
                      onSelect={(icon) => setFormData({ ...formData, icon })}
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                    placeholder="Describe para qué se utiliza esta categoría..."
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00E676] text-gray-900 rounded-lg hover:bg-[#00E676]/90 font-medium"
                >
                  {formMode === 'create' ? 'Crear Categoría' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Lista de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categorías de Ingresos */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-900 bg-opacity-30 px-4 py-3 border-b border-gray-700">
            <h3 className="text-lg font-medium text-green-300 flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
              Categorías de Ingresos
            </h3>
          </div>
          
          {groupedCategories.income.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {groupedCategories.income.map(category => (
                <li key={category.id} className="p-4 hover:bg-gray-750">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: category.color }}
                      >
                        <IconSelector 
                          selected={category.icon} 
                          readOnly 
                          color="white"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{category.name}</h4>
                        {category.description && (
                          <p className="text-gray-400 text-sm">{category.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                        aria-label="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-700"
                        aria-label="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <FaTags className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No hay categorías de ingresos</p>
              {searchTerm && <p className="text-sm mt-2">Prueba con otra búsqueda</p>}
            </div>
          )}
        </div>
        
        {/* Categorías de Gastos */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-900 bg-opacity-30 px-4 py-3 border-b border-gray-700">
            <h3 className="text-lg font-medium text-red-300 flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
              Categorías de Gastos
            </h3>
          </div>
          
          {groupedCategories.expense.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {groupedCategories.expense.map(category => (
                <li key={category.id} className="p-4 hover:bg-gray-750">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: category.color }}
                      >
                        <IconSelector 
                          selected={category.icon} 
                          readOnly
                          color="white"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{category.name}</h4>
                        {category.description && (
                          <p className="text-gray-400 text-sm">{category.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                        aria-label="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-700"
                        aria-label="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <FaTags className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No hay categorías de gastos</p>
              {searchTerm && <p className="text-sm mt-2">Prueba con otra búsqueda</p>}
            </div>
          )}
        </div>
      </div>
      
      {/* Tips y recomendaciones */}
      <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <FaPalette className="text-[#00E676]" /> Consejos para categorías
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-[#00E676]">
            <h4 className="font-medium text-white mb-2">Categorías claras</h4>
            <p className="text-gray-400 text-sm">
              Utiliza nombres claros y descriptivos para tus categorías. Evita categorías demasiado generales como "Otros".
            </p>
          </div>
          <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-[#00E676]">
            <h4 className="font-medium text-white mb-2">Códigos de colores</h4>
            <p className="text-gray-400 text-sm">
              Usa colores similares para categorías relacionadas. Por ejemplo, tonos de azul para gastos de vivienda y servicios.
            </p>
          </div>
          <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-[#00E676]">
            <h4 className="font-medium text-white mb-2">Personaliza tus iconos</h4>
            <p className="text-gray-400 text-sm">
              Elige iconos representativos para cada categoría. Un buen icono facilita la identificación rápida en gráficos.
            </p>
          </div>
          <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-[#00E676]">
            <h4 className="font-medium text-white mb-2">Revisa regularmente</h4>
            <p className="text-gray-400 text-sm">
              Actualiza tus categorías a medida que cambien tus hábitos financieros o detectes nuevas necesidades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 