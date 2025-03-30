'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaPlus, FaFilter, FaSearch, FaFileExport, FaFileImport, 
  FaArrowUp, FaArrowDown, FaEdit, FaTrash, FaTimes, FaSave,
  FaSortAmountDown, FaSortAmountUpAlt, FaCalendarAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

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
  category: z.string().min(1, 'La categoría es requerida'),
  notes: z.string().optional()
});

// Datos de categorías de ejemplo
const CATEGORIES = {
  expense: [
    { id: 'food', name: 'Alimentación', color: '#FF5252' },
    { id: 'transport', name: 'Transporte', color: '#448AFF' },
    { id: 'entertainment', name: 'Entretenimiento', color: '#7C4DFF' },
    { id: 'services', name: 'Servicios', color: '#FFD740' },
    { id: 'health', name: 'Salud', color: '#64FFDA' },
    { id: 'shopping', name: 'Compras', color: '#FF4081' },
    { id: 'home', name: 'Hogar', color: '#FF6E40' },
    { id: 'education', name: 'Educación', color: '#69F0AE' },
  ],
  income: [
    { id: 'salary', name: 'Salario', color: '#00E676' },
    { id: 'freelance', name: 'Freelance', color: '#1DE9B6' },
    { id: 'investments', name: 'Inversiones', color: '#00B0FF' },
    { id: 'gifts', name: 'Regalos', color: '#D500F9' },
    { id: 'other_income', name: 'Otros ingresos', color: '#FFEA00' },
  ]
};

// Datos de ejemplo para transacciones
const DEMO_TRANSACTIONS = [
  {
    id: 1,
    description: 'Salario mensual',
    amount: 15000,
    date: '2023-03-01',
    type: 'income',
    category: 'salary',
    notes: 'Salario del mes de marzo'
  },
  {
    id: 2,
    description: 'Compra supermercado',
    amount: 1250.50,
    date: '2023-03-03',
    type: 'expense',
    category: 'food',
    notes: 'Compra semanal en supermercado'
  },
  {
    id: 3,
    description: 'Gasolina',
    amount: 800,
    date: '2023-03-05',
    type: 'expense',
    category: 'transport',
    notes: 'Tanque lleno'
  },
  {
    id: 4,
    description: 'Netflix',
    amount: 219,
    date: '2023-03-10',
    type: 'expense',
    category: 'entertainment',
    notes: 'Suscripción mensual'
  },
  {
    id: 5,
    description: 'Proyecto freelance',
    amount: 5000,
    date: '2023-03-15',
    type: 'income',
    category: 'freelance',
    notes: 'Proyecto para cliente XYZ'
  },
  {
    id: 6,
    description: 'Restaurante con amigos',
    amount: 750,
    date: '2023-03-18',
    type: 'expense',
    category: 'food',
    notes: 'Cena del viernes'
  },
  {
    id: 7,
    description: 'Pago luz',
    amount: 450,
    date: '2023-03-20',
    type: 'expense',
    category: 'services',
    notes: 'Factura bimestral'
  },
  {
    id: 8,
    description: 'Dividendos',
    amount: 1200,
    date: '2023-03-25',
    type: 'income',
    category: 'investments',
    notes: 'Dividendos trimestrales'
  }
];

export default function TransactionsPage() {
  // Estados para manejar transacciones
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [sortConfig, setSortConfig] = useState({ field: 'date', direction: 'desc' });
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });
  
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
      category: '',
      notes: ''
    }
  });
  
  const selectedType = watch('type');
  
  // Cargar datos de ejemplo al iniciar
  useEffect(() => {
    setTransactions(DEMO_TRANSACTIONS);
    setFilteredTransactions(DEMO_TRANSACTIONS);
  }, []);
  
  // Función para aplicar filtros
  useEffect(() => {
    let result = [...transactions];
    
    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        t => t.description.toLowerCase().includes(searchLower) || 
             t.notes?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por tipo
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }
    
    // Filtrar por categoría
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }
    
    // Filtrar por fecha desde
    if (filters.dateFrom) {
      result = result.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    }
    
    // Filtrar por fecha hasta
    if (filters.dateTo) {
      result = result.filter(t => new Date(t.date) <= new Date(filters.dateTo));
    }
    
    // Filtrar por monto mínimo
    if (filters.amountMin) {
      result = result.filter(t => t.amount >= parseFloat(filters.amountMin));
    }
    
    // Filtrar por monto máximo
    if (filters.amountMax) {
      result = result.filter(t => t.amount <= parseFloat(filters.amountMax));
    }
    
    // Aplicar ordenamiento
    result = result.sort((a, b) => {
      if (sortConfig.field === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortConfig.field === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });
    
    setFilteredTransactions(result);
  }, [transactions, filters, sortConfig]);
  
  // Función para manejar la creación/edición de transacciones
  const onSubmit = (data) => {
    const newTransaction = {
      ...data,
      amount: parseFloat(data.amount),
      id: editingTransaction ? editingTransaction.id : Date.now()
    };
    
    if (editingTransaction) {
      // Editar transacción existente
      setTransactions(prev => 
        prev.map(t => t.id === editingTransaction.id ? newTransaction : t)
      );
    } else {
      // Crear nueva transacción
      setTransactions(prev => [...prev, newTransaction]);
    }
    
    // Resetear formulario y estado
    reset();
    setShowForm(false);
    setEditingTransaction(null);
  };
  
  // Función para editar una transacción
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    
    // Establecer valores en el formulario
    setValue('description', transaction.description);
    setValue('amount', transaction.amount.toString());
    setValue('date', transaction.date);
    setValue('type', transaction.type);
    setValue('category', transaction.category);
    setValue('notes', transaction.notes || '');
    
    setShowForm(true);
  };
  
  // Función para eliminar una transacción
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
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
  };
  
  // Función para obtener el componente de icono del tipo de transacción
  const getTypeIcon = (type) => {
    return type === 'income' 
      ? <FaArrowUp className="text-green-500" /> 
      : <FaArrowDown className="text-red-500" />;
  };
  
  // Función para obtener el color de categoría
  const getCategoryColor = (categoryId, type) => {
    const category = CATEGORIES[type]?.find(c => c.id === categoryId);
    return category?.color || '#CCCCCC';
  };
  
  // Función para obtener el nombre de categoría
  const getCategoryName = (categoryId, type) => {
    const category = CATEGORIES[type]?.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  };
  
  // Calcular balance
  const calculateBalance = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Transacciones</h1>
          <p className="text-gray-400">Administra tus ingresos y gastos</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
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
                  <select
                    className="w-full bg-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="all">Todas</option>
                    <optgroup label="Ingresos">
                      {CATEGORIES.income.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Gastos">
                      {CATEGORIES.expense.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
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
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-left">Descripción</th>
                <th className="py-3 px-4 text-left">
                  <button 
                    onClick={() => handleSort('date')}
                    className="flex items-center text-gray-400 hover:text-white"
                  >
                    Fecha
                    {sortConfig.field === 'date' && 
                      (sortConfig.direction === 'asc' 
                        ? <FaSortAmountUpAlt className="ml-1" /> 
                        : <FaSortAmountDown className="ml-1" />
                      )
                    }
                  </button>
                </th>
                <th className="py-3 px-4 text-left">Categoría</th>
                <th className="py-3 px-4 text-left">
                  <button 
                    onClick={() => handleSort('amount')}
                    className="flex items-center text-gray-400 hover:text-white"
                  >
                    Monto
                    {sortConfig.field === 'amount' && 
                      (sortConfig.direction === 'asc' 
                        ? <FaSortAmountUpAlt className="ml-1" /> 
                        : <FaSortAmountDown className="ml-1" />
                      )
                    }
                  </button>
                </th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-gray-750">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getTypeIcon(transaction.type)}
                        <span className="ml-2">{transaction.description}</span>
                      </div>
                      {transaction.notes && (
                        <div className="text-xs text-gray-400 mt-1">{transaction.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-500 mr-2" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: getCategoryColor(transaction.category, transaction.type) }}
                        ></div>
                        {getCategoryName(transaction.category, transaction.type)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(transaction)}
                          className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(transaction.id)}
                          className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-400">
                    No se encontraron transacciones. Prueba con otros filtros o crea una nueva transacción.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
                    <select
                      className="w-full bg-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                      {...register('category')}
                    >
                      <option value="">Selecciona una categoría</option>
                      {CATEGORIES[selectedType]?.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>
                    )}
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
                  <Button type="submit" leftIcon={<FaSave />}>
                    {editingTransaction ? 'Actualizar' : 'Guardar'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 