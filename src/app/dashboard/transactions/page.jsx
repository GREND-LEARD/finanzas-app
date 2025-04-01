'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaPlus, FaFilter, FaSearch, FaFileExport, FaFileImport, 
  FaArrowUp, FaArrowDown, FaEdit, FaTrash, FaTimes, FaSave,
  FaSortAmountDown, FaSortAmountUpAlt, FaCalendarAlt, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import toast from 'react-hot-toast';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Importar hooks reales
import {
  useTransactions,
  useAddTransaction,
  useUpdateTransaction,
  useDeleteTransaction
} from '../../../lib/hooks/use-transactions';
import { useCategories } from '../../../lib/hooks/use-categories';

// Esquema de validación para las transacciones
const transactionSchema = z.object({
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'El monto debe ser un número positivo'
  }),
  date: z.string().min(1, 'La fecha es requerida'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Selecciona un tipo válido' })
  }),
  category_id: z.string().uuid("Selecciona una categoría válida").min(1, 'La categoría es requerida'),
  notes: z.string().optional()
});

const PAGE_SIZE = 10; // Definir tamaño de página

export default function TransactionsPage() {
  // Estados para filtros y ordenación (se mantienen)
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [sortConfig, setSortConfig] = useState({ field: 'date', direction: 'desc' });
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual

  // Usar hooks para datos, pasando paginación
  const { 
      data: queryResult, // Renombrar data a queryResult para claridad
      isLoading: isLoadingTransactions 
  } = useTransactions(filters, sortConfig, currentPage, PAGE_SIZE);
  
  // Extraer datos y conteo del resultado
  const transactionsData = queryResult?.data || [];
  const totalCount = queryResult?.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const { data: categoriesData = [], isLoading: isLoadingCategories } = useCategories();
  
  // --- LOGS PARA DIAGNÓSTICO ---
  console.log('isLoadingCategories:', isLoadingCategories);
  console.log('categoriesData:', categoriesData);
  // --- FIN LOGS ---
  
  // Hooks de mutación
  const addMutation = useAddTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const isMutating = addMutation.isPending || updateMutation.isPending;
  
  // Formulario para crear/editar transacciones
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      category_id: '',
      notes: ''
    }
  });
  
  const selectedType = watch('type');
  
  // Usar useMemo para obtener listas de categorías formateadas
  const categoriesOptions = useMemo(() => {
      if (isLoadingCategories) return { income: [], expense: [] };
      const options = {
          income: categoriesData.filter(c => c.type === 'income').map(c => ({ value: c.id, label: c.name })),
          expense: categoriesData.filter(c => c.type === 'expense').map(c => ({ value: c.id, label: c.name }))
      };
      // --- LOGS PARA DIAGNÓSTICO ---
      console.log('Generated categoriesOptions:', options);
      // --- FIN LOGS ---
      return options;
  }, [categoriesData, isLoadingCategories]);

  // Función onSubmit adaptada para usar mutaciones (CON DEPURACIÓN)
  const onSubmit = async (data) => {
    const transactionData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    
    // Quitar temporalmente toast.promise para depurar el error
    // const promise = new Promise(async (resolve, reject) => { ... });

    if (editingTransaction) {
      // INTENTAR ACTUALIZAR
      try {
        console.log("Intentando actualizar con datos:", { id: editingTransaction.id, ...transactionData });
        await updateMutation.mutateAsync({ id: editingTransaction.id, ...transactionData });
        toast.success('Transacción actualizada con éxito');
        reset(); 
        setShowForm(false);
        setEditingTransaction(null);
      } catch (error) {
        // --- CAPTURA DE ERROR ESPECÍFICO DE ACTUALIZAR ---
        console.error("Error específico al ACTUALIZAR:", error);
        const errorMessage = error?.message || (typeof error === 'string' ? error : 'No se pudo actualizar');
        toast.error(`Error al actualizar: ${errorMessage}`);
        // --- FIN CAPTURA ---
      }
    } else {
      // INTENTAR CREAR
      try {
        console.log("Intentando crear con datos:", transactionData);
        await addMutation.mutateAsync(transactionData);
        toast.success('Transacción creada con éxito');
        reset(); 
        setShowForm(false);
        setEditingTransaction(null); // Asegurarse de limpiar esto también
      } catch (error) {
        // --- CAPTURA DE ERROR ESPECÍFICO DE CREAR ---
        console.error("Error específico al CREAR:", error); 
        const errorMessage = error?.message || (typeof error === 'string' ? error : 'No se pudo crear');
        toast.error(`Error al crear: ${errorMessage}`);
        // --- FIN CAPTURA ---
      }
    }

    // Eliminar llamada a toast.promise ya que los toasts se manejan en los catch/try
    // toast.promise(promise, { ... });
  };

  // Función para editar una transacción
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    
    // Establecer valores en el formulario
    setValue('description', transaction.description);
    setValue('amount', transaction.amount.toString());
    const dateFormatted = transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '';
    setValue('date', dateFormatted);
    setValue('type', transaction.type);
    setValue('category_id', transaction.category_id);
    setValue('notes', transaction.notes || '');
    
    setShowForm(true);
  };
  
  // Función para eliminar una transacción
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      deleteMutation.mutateAsync(id);
    }
  };
  
  // Función para alternar dirección de ordenamiento
  const handleSort = (field) => {
    setSortConfig({
      field,
      direction: 
        sortConfig.field === field && sortConfig.direction === 'desc' 
          ? 'asc' 
          : 'desc'
    });
  };
  
  // Función para resetear filtros
  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
    setSortConfig({ field: 'date', direction: 'desc' }); // Opcional: resetear orden
    setCurrentPage(1); // Resetear página
  };
  
  // Función para obtener el componente de icono del tipo de transacción
  const getTypeIcon = (type) => {
    return type === 'income' 
      ? <FaArrowUp className="text-green-500" /> 
      : <FaArrowDown className="text-red-500" />;
  };
  
  // Función para obtener el color de categoría
  const getCategoryColor = (categoryId, type) => {
    const category = categoriesData.find(c => c.id === categoryId && c.type === type);
    return category?.color || '#CCCCCC';
  };
  
  // Función para obtener el nombre de categoría
  const getCategoryName = (categoryId, type) => {
    const category = categoriesData.find(c => c.id === categoryId && c.type === type);
    return category?.name || 'Sin categoría';
  };
  
  // Calcular balance
  const calculateBalance = () => {
    const income = transactionsData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactionsData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  };
  
  const { income, expenses, balance } = calculateBalance();
  
  // Formatear montos a moneda local
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // --- FUNCIONES DE PAGINACIÓN ---
  const handleNextPage = () => {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  const handlePrevPage = () => {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Resetear a página 1 cuando cambian los filtros o la ordenación
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortConfig]);

  // Manejo de estados de carga principales
  if (isLoadingTransactions || isLoadingCategories) {
     return <div>Cargando...</div>; // TODO: Mejorar estado de carga
  }

  // --- LOG PARA VER DATOS RECIBIDOS ---
  console.log('[TransactionsPage] Renderizando con:', { 
    isLoadingTransactions, 
    transactionsData, 
    totalCount, 
    currentPage, 
    filters, 
    sortConfig 
  });
  // --- FIN LOG ---

  return (
    <SkeletonTheme baseColor="#2D3748" highlightColor="#4A5568">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-900 min-h-screen text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Gestión de Transacciones</h1>
        
        {/* Barra de acciones */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <Button onClick={() => { setShowForm(true); setEditingTransaction(null); }} leftIcon={<FaPlus />}>
            Nueva Transacción
          </Button>
          <Button 
            variant="outline" 
            leftIcon={<FaFilter />} 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'border-green-500 text-green-500' : ''}
          >
            Filtros
          </Button>
          <Button variant="outline" leftIcon={<FaFileExport />}>
            Exportar
          </Button>
          <Button variant="outline" leftIcon={<FaFileImport />}>
            Importar
          </Button>
        </div>
        
        {/* Resumen de balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-gray-800 to-gray-700">
            <div className="text-sm text-gray-400 mb-1">Ingresos</div>
            <div className="text-xl font-bold text-green-400">{formatCurrency(income)}</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-gray-800 to-gray-700">
            <div className="text-sm text-gray-400 mb-1">Gastos</div>
            <div className="text-xl font-bold text-red-400">{formatCurrency(expenses)}</div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-gray-800 to-gray-700">
            <div className="text-sm text-gray-400 mb-1">Balance</div>
            <div className={`text-xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(balance)}
            </div>
          </Card>
        </div>
        
        {/* Panel de filtros */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">Filtros</h2>
                  <Button 
                    variant="text" 
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    Restablecer
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Búsqueda</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar por descripción o notas"
                        className="w-full bg-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      />
                      <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Tipo</label>
                    <select
                      className="w-full bg-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="all">Todos</option>
                      <option value="income">Ingresos</option>
                      <option value="expense">Gastos</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Categoría</label>
                    <Select
                      label="Categoría"
                      {...register('category_id')}
                      error={errors.category_id?.message}
                      options={(() => {
                        const opts = categoriesOptions[selectedType] || [];
                        console.log(`Options for type '${selectedType}':`, opts);
                        return opts;
                      })()}
                      disabled={!selectedType || isLoadingCategories}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Fecha desde</label>
                    <input
                      type="date"
                      className="w-full bg-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Fecha hasta</label>
                    <input
                      type="date"
                      className="w-full bg-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Monto mínimo</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                        value={filters.amountMin}
                        onChange={(e) => setFilters(prev => ({ ...prev, amountMin: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Monto máximo</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                        value={filters.amountMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, amountMax: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tabla de transacciones */}
        <Card title="Historial de Transacciones">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Categoría</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Monto</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoadingTransactions ? (
                  [...Array(PAGE_SIZE)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-3 px-4"><Skeleton width={80} /></td>
                      <td className="py-3 px-4"><Skeleton count={1} /></td>
                      <td className="py-3 px-4"><Skeleton width={100} /></td>
                      <td className="py-3 px-4 text-right"><Skeleton width={60} /></td>
                      <td className="py-3 px-4 text-center"><Skeleton circle={true} height={24} width={24} /></td>
                      <td className="py-3 px-4 text-center"><Skeleton width={50} /></td>
                    </tr>
                  ))
                ) : transactionsData.length > 0 ? (
                  transactionsData.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-800">
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 max-w-xs truncate text-sm font-medium text-white" title={t.description}>{t.description}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" style={{ backgroundColor: getCategoryColor(t.category_id, t.type) + '30', color: getCategoryColor(t.category_id, t.type) }}>
                          {getCategoryName(t.category_id, t.type)}
                        </span>
                      </td>
                      <td className={`py-3 px-4 whitespace-nowrap text-sm text-right font-medium ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(t.amount)}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-center text-sm">{getTypeIcon(t.type)}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300"><FaEdit /></button>
                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-400"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">No se encontraron transacciones con los filtros aplicados.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Controles de Paginación */} 
          {totalCount > 0 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-700">
                  <span className="text-sm text-gray-400">
                      Mostrando {transactionsData.length} de {totalCount} transacciones
                  </span>
                  <div className="flex items-center space-x-2">
                      <Button 
                          variant="outline"
                          size="sm"
                          onClick={handlePrevPage} 
                          disabled={currentPage === 1}
                          leftIcon={<FaChevronLeft size={12}/>}
                      >
                          Anterior
                      </Button>
                      <span className="text-sm text-gray-400">
                          Página {currentPage} de {totalPages}
                      </span>
                      <Button 
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage} 
                          disabled={currentPage === totalPages}
                          rightIcon={<FaChevronRight size={12}/>}
                      >
                          Siguiente
                      </Button>
                  </div>
              </div>
          )}
        </Card>
        
        {/* Modal para crear/editar transacción */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-800 rounded-lg w-full max-w-lg"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-white">
                    {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
                  </h2>
                  <button 
                    onClick={() => { setShowForm(false); setEditingTransaction(null); reset(); }}
                    className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Descripción"
                        placeholder="Descripción de la transacción"
                        {...register('description')}
                        error={errors.description?.message}
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="Monto"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register('amount')}
                        error={errors.amount?.message}
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="Fecha"
                        type="date"
                        {...register('date')}
                        error={errors.date?.message}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Tipo</label>
                      <div className="flex space-x-2">
                        <div
                          className={`flex-1 p-2 rounded-lg flex items-center justify-center cursor-pointer ${
                            selectedType === 'expense'
                              ? 'bg-red-500 bg-opacity-20 text-red-400 border border-red-500'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
                          }`}
                          onClick={() => setValue('type', 'expense')}
                        >
                          <FaArrowDown className="mr-2" />
                          Gasto
                        </div>
                        <div
                          className={`flex-1 p-2 rounded-lg flex items-center justify-center cursor-pointer ${
                            selectedType === 'income'
                              ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
                          }`}
                          onClick={() => setValue('type', 'income')}
                        >
                          <FaArrowUp className="mr-2" />
                          Ingreso
                        </div>
                      </div>
                      {errors.type && (
                        <p className="text-xs text-red-400 mt-1">{errors.type.message}</p>
                      )}
                      <input type="hidden" {...register('type')} />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Categoría</label>
                      <Select
                        label="Categoría"
                        {...register('category_id')}
                        error={errors.category_id?.message}
                        options={categoriesOptions[selectedType] || []}
                        disabled={!selectedType || isLoadingCategories}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 text-sm mb-1">Notas (opcional)</label>
                      <textarea
                        className="w-full bg-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                        rows="3"
                        placeholder="Notas adicionales sobre la transacción..."
                        {...register('notes')}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                    <Button 
                      variant="outline" 
                      onClick={() => { setShowForm(false); setEditingTransaction(null); reset(); }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" leftIcon={<FaSave />} disabled={isMutating}>
                      {editingTransaction ? 'Actualizar' : 'Guardar'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </SkeletonTheme>
  );
} 