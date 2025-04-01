'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPalette, FaSearch, FaTags } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import IconSelector from '../../../components/forms/IconSelector';
import toast from 'react-hot-toast';
import {
  useCategories,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory
} from '../../../lib/hooks/use-categories';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Paleta de colores sugeridos
const COLOR_PALETTE = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', 
  '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40', '#8D6E63', '#78909C',
  '#26A69A', '#66BB6A', '#9CCC65', '#00E676', '#FFC107', '#FF9800'
];

export default function CategoriesPage() {
  // Usar hooks reales
  const { data: categoriesData = [], isLoading: isLoadingCategories } = useCategories();
  const addMutation = useAddCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const isMutating = addMutation.isPending || updateMutation.isPending;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#00E676',
    icon: 'FaTags',
    description: ''
  });
  
  const filteredCategories = useMemo(() => {
    return categoriesData.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (category.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || category.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [categoriesData, searchTerm, filterType]);
  
  const groupedCategories = useMemo(() => ({
    income: filteredCategories.filter(cat => cat.type === 'income'),
    expense: filteredCategories.filter(cat => cat.type === 'expense')
  }), [filteredCategories]);
  
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
  
  const handleSaveCategory = (e) => {
    e.preventDefault();
    
    const categoryData = { ...formData };
    delete categoryData.id;

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (formMode === 'create') {
          await addMutation.mutateAsync(categoryData);
          resolve('Categoría creada');
        } else {
          await updateMutation.mutateAsync({ id: selectedCategory.id, ...categoryData });
          resolve('Categoría actualizada');
        }
        setIsFormOpen(false);
        setSelectedCategory(null);
      } catch (error) {
        console.error("Error guardando categoría:", error);
        reject(error.message || "Error al guardar");
      }
    });

    toast.promise(promise, {
      loading: 'Guardando...',
      success: (msg) => msg,
      error: (err) => err
    });
  };
  
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría? Las transacciones asociadas no se eliminarán, pero perderán su categorización.')) {
       const promise = new Promise(async (resolve, reject) => {
         try {
           await deleteMutation.mutateAsync(categoryId);
           resolve('Categoría eliminada');
         } catch (error) {
           console.error("Error eliminando categoría:", error);
           reject(error.message || "Error al eliminar");
         }
       });
        toast.promise(promise, {
          loading: 'Eliminando...',
          success: (msg) => msg,
          error: (err) => err
        });
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  return (
    <SkeletonTheme baseColor="#2D3748" highlightColor="#4A5568">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Categorías</h1>
          <p className="text-gray-400">Personaliza las categorías para tus ingresos y gastos.</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-[#00E676] bg-opacity-20 rounded-lg text-[#00E676]">
                <FaTags className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-white font-semibold">Categorías personalizadas</h2>
                <p className="text-sm text-gray-400">
                  {categoriesData.length} categorías en total ({groupedCategories.income.length} de ingresos, {groupedCategories.expense.length} de gastos)
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-4">Ingresos ({groupedCategories.income.length})</h2>
            {isLoadingCategories ? (
              <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} height={80} />)}</div>
            ) : groupedCategories.income.length > 0 ? (
              <div className="space-y-4">
                {groupedCategories.income.map(cat => (
                  <motion.div key={cat.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between border border-gray-700">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: cat.color }}
                      >
                        <IconSelector 
                          selected={cat.icon} 
                          readOnly 
                          color="white"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{cat.name}</h4>
                        {cat.description && (
                          <p className="text-gray-400 text-sm">{cat.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleEditCategory(cat)}><FaEdit/></button>
                      <button onClick={() => handleDeleteCategory(cat.id)} disabled={deleteMutation.isPending}><FaTrash/></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay categorías de ingresos.</p>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-red-400 mb-4">Gastos ({groupedCategories.expense.length})</h2>
            {isLoadingCategories ? (
              <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} height={80} />)}</div>
            ) : groupedCategories.expense.length > 0 ? (
              <div className="space-y-4">
                {groupedCategories.expense.map(cat => (
                  <motion.div key={cat.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between border border-gray-700">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: cat.color }}
                      >
                        <IconSelector 
                          selected={cat.icon} 
                          readOnly
                          color="white"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{cat.name}</h4>
                        {cat.description && (
                          <p className="text-gray-400 text-sm">{cat.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleEditCategory(cat)}><FaEdit/></button>
                      <button onClick={() => handleDeleteCategory(cat.id)} disabled={deleteMutation.isPending}><FaTrash/></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay categorías de gastos.</p>
            )}
          </div>
        </div>
        
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
    </SkeletonTheme>
  );
} 