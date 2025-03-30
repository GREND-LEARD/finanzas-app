'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaRegClock,
  FaCoins
} from 'react-icons/fa';

// Datos simulados de presupuestos
const mockBudgets = [
  {
    id: 1,
    name: 'Alimentación',
    limit: 1200,
    spent: 950,
    icon: 'food',
    color: '#00E676',
    period: 'monthly'
  },
  {
    id: 2,
    name: 'Transporte',
    limit: 500,
    spent: 480,
    icon: 'transport',
    color: '#64B5F6',
    period: 'monthly'
  },
  {
    id: 3,
    name: 'Entretenimiento',
    limit: 600,
    spent: 720,
    icon: 'entertainment',
    color: '#FF5252',
    period: 'monthly'
  },
  {
    id: 4,
    name: 'Servicios',
    limit: 800,
    spent: 790,
    icon: 'utilities',
    color: '#FFD54F',
    period: 'monthly'
  },
  {
    id: 5,
    name: 'Salud',
    limit: 400,
    spent: 120,
    icon: 'health',
    color: '#BA68C8',
    period: 'monthly'
  }
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState(mockBudgets);
  const [showForm, setShowForm] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    spent: '0',
    icon: 'general',
    color: '#00E676',
    period: 'monthly'
  });
  
  // Cálculo de estadísticas generales
  const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overallProgress = Math.round((totalSpent / totalLimit) * 100);
  const overBudgetCount = budgets.filter(budget => budget.spent > budget.limit).length;
  
  // Datos para el gráfico circular de presupuestos
  const budgetChartData = budgets.map(budget => ({
    name: budget.name,
    value: budget.limit,
    color: budget.color
  }));
  
  // Datos para el gráfico circular de gastos
  const spentChartData = budgets.map(budget => ({
    name: budget.name,
    value: budget.spent,
    color: budget.color
  }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentBudget) {
      // Actualizar presupuesto existente
      setBudgets(budgets.map(budget => 
        budget.id === currentBudget.id ? 
        {...budget, ...formData, limit: parseFloat(formData.limit), spent: parseFloat(formData.spent)} : 
        budget
      ));
    } else {
      // Crear nuevo presupuesto
      setBudgets([
        ...budgets, 
        {
          id: Date.now(),
          ...formData,
          limit: parseFloat(formData.limit),
          spent: parseFloat(formData.spent)
        }
      ]);
    }
    resetForm();
  };
  
  const handleEdit = (budget) => {
    setCurrentBudget(budget);
    setFormData({
      name: budget.name,
      limit: budget.limit,
      spent: budget.spent,
      icon: budget.icon,
      color: budget.color,
      period: budget.period
    });
    setShowForm(true);
  };
  
  const handleDelete = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };
  
  const resetForm = () => {
    setShowForm(false);
    setCurrentBudget(null);
    setFormData({
      name: '',
      limit: '',
      spent: '0',
      icon: 'general',
      color: '#00E676',
      period: 'monthly'
    });
  };
  
  // Obtener estado del presupuesto (bajo, medio, excedido)
  const getBudgetStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'safe';
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">Gestión de Presupuestos</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center px-4 py-2 bg-[#00E676] text-gray-900 rounded-lg hover:bg-opacity-80 transition-all"
          >
            <FaPlus className="mr-2" /> Nuevo Presupuesto
          </button>
        </div>
        
        {/* Resumen de presupuestos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700"
          >
            <p className="text-gray-400 text-sm">Presupuesto Total</p>
            <h3 className="text-3xl font-bold text-white mt-2">${totalLimit.toLocaleString()}</h3>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700"
          >
            <p className="text-gray-400 text-sm">Gasto Actual</p>
            <h3 className="text-3xl font-bold text-white mt-2">${totalSpent.toLocaleString()}</h3>
            <p className={`text-sm mt-1 ${totalSpent <= totalLimit ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
              {totalSpent <= totalLimit ? `$${(totalLimit - totalSpent).toLocaleString()} disponibles` : `$${(totalSpent - totalLimit).toLocaleString()} excedidos`}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`bg-gray-800 rounded-xl p-5 border ${overallProgress > 100 ? 'border-[#FF5252]' : 'border-gray-700'}`}
          >
            <p className="text-gray-400 text-sm">Progreso General</p>
            <h3 className={`text-3xl font-bold mt-2 ${overallProgress > 100 ? 'text-[#FF5252]' : 'text-white'}`}>{overallProgress}%</h3>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
              <div 
                className={`h-2.5 rounded-full ${overallProgress > 100 ? 'bg-[#FF5252]' : 'bg-[#00E676]'}`} 
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              ></div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className={`bg-gray-800 rounded-xl p-5 border ${overBudgetCount > 0 ? 'border-[#FFD54F]' : 'border-gray-700'}`}
          >
            <p className="text-gray-400 text-sm">Categorías Excedidas</p>
            <h3 className={`text-3xl font-bold mt-2 ${overBudgetCount > 0 ? 'text-[#FFD54F]' : 'text-white'}`}>
              {overBudgetCount}
            </h3>
            <p className="text-sm mt-1 text-gray-400">
              {overBudgetCount === 0 ? 'Todos los presupuestos bajo control' : `${(overBudgetCount / budgets.length * 100).toFixed(0)}% de tus presupuestos`}
            </p>
          </motion.div>
        </div>
        
        {/* Formulario para crear/editar presupuestos */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              {currentBudget ? 'Editar Presupuesto' : 'Crear Nuevo Presupuesto'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre de la categoría
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Límite de gasto
                  </label>
                  <input
                    type="number"
                    value={formData.limit}
                    onChange={(e) => setFormData({...formData, limit: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Gasto actual
                  </label>
                  <input
                    type="number"
                    value={formData.spent}
                    onChange={(e) => setFormData({...formData, spent: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Periodo
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="monthly">Mensual</option>
                    <option value="weekly">Semanal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full h-10 px-1 py-1 bg-gray-700 border border-gray-600 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ícono
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="general">General</option>
                    <option value="food">Alimentación</option>
                    <option value="transport">Transporte</option>
                    <option value="entertainment">Entretenimiento</option>
                    <option value="utilities">Servicios</option>
                    <option value="health">Salud</option>
                    <option value="education">Educación</option>
                    <option value="housing">Vivienda</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00E676] text-gray-900 rounded-lg hover:bg-opacity-80"
                >
                  {currentBudget ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Gráficos de visualización */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Distribución de Presupuestos</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {budgetChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Límite']}
                    contentStyle={{ backgroundColor: '#333', borderColor: '#444', color: 'white' }}
                  />
                  <Legend formatter={(value) => <span style={{ color: 'white' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Distribución de Gastos</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spentChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {spentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Gasto']}
                    contentStyle={{ backgroundColor: '#333', borderColor: '#444', color: 'white' }}
                  />
                  <Legend formatter={(value) => <span style={{ color: 'white' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Lista de presupuestos */}
        <div className="mt-8">
          <h3 className="text-xl font-medium text-white mb-4">Tus Presupuestos</h3>
          <div className="space-y-4">
            {budgets.map((budget) => {
              const progress = Math.round((budget.spent / budget.limit) * 100);
              const status = getBudgetStatus(budget.spent, budget.limit);
              
              return (
                <div 
                  key={budget.id} 
                  className={`bg-gray-800 rounded-xl overflow-hidden border ${
                    status === 'exceeded' ? 'border-[#FF5252]' : 
                    status === 'warning' ? 'border-[#FFD54F]' : 
                    'border-gray-700'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: budget.color }}
                        >
                          {status === 'exceeded' ? (
                            <FaExclamationTriangle className="w-5 h-5 text-gray-900" />
                          ) : status === 'warning' ? (
                            <FaRegClock className="w-5 h-5 text-gray-900" />
                          ) : (
                            <FaCheckCircle className="w-5 h-5 text-gray-900" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-lg">
                            {budget.name}
                            <span className="ml-2 text-xs inline-block px-2 py-0.5 rounded-full bg-opacity-20" style={{ backgroundColor: budget.color, color: budget.color }}>
                              {budget.period === 'monthly' ? 'Mensual' : 
                               budget.period === 'weekly' ? 'Semanal' : 'Anual'}
                            </span>
                          </h3>
                          <div className="flex mt-1">
                            <p className={`text-sm ${status === 'exceeded' ? 'text-[#FF5252]' : 'text-gray-400'}`}>
                              Gastado: ${budget.spent.toLocaleString()} {status === 'exceeded' && `(+$${(budget.spent - budget.limit).toLocaleString()})`}
                            </p>
                            <span className="mx-2 text-gray-600">•</span>
                            <p className="text-sm text-gray-400">
                              Límite: ${budget.limit.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(budget)}
                          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(budget.id)}
                          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-red-700 hover:text-white"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            status === 'exceeded' ? 'bg-[#FF5252]' : 
                            status === 'warning' ? 'bg-[#FFD54F]' : 
                            'bg-[#00E676]'
                          }`} 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-400">Progreso</span>
                        <span className={`text-sm font-medium ${
                          status === 'exceeded' ? 'text-[#FF5252]' : 
                          status === 'warning' ? 'text-[#FFD54F]' : 
                          'text-[#00E676]'
                        }`}>
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {budgets.length === 0 && (
            <div className="text-center py-12">
              <FaCoins className="mx-auto text-gray-600 w-12 h-12 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No has creado presupuestos</h3>
              <p className="text-gray-400">Los presupuestos te ayudan a controlar tus gastos y alcanzar tus metas financieras.</p>
              <button 
                onClick={() => setShowForm(true)} 
                className="mt-4 px-4 py-2 bg-[#00E676] text-gray-900 rounded-lg hover:bg-opacity-80"
              >
                Crear tu primer presupuesto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 