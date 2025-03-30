'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck,
  FaRegLightbulb,
  FaBullseye,
  FaRegCalendarAlt,
  FaHome,
  FaLaptop
} from 'react-icons/fa';

// Datos simulados para metas financieras
const mockGoals = [
  {
    id: 1,
    name: 'Fondo de emergencia',
    target: 10000,
    current: 6500,
    deadline: '2024-12-31',
    color: '#00E676',
    icon: 'emergency',
    status: 'in_progress'
  },
  {
    id: 2,
    name: 'Viaje a Europa',
    target: 25000,
    current: 12000,
    deadline: '2025-06-30',
    color: '#64B5F6',
    icon: 'travel',
    status: 'in_progress'
  },
  {
    id: 3,
    name: 'Entrada para casa',
    target: 50000,
    current: 5000,
    deadline: '2026-01-15',
    color: '#FFD54F',
    icon: 'home',
    status: 'in_progress'
  },
  {
    id: 4,
    name: 'Nuevo ordenador',
    target: 2000,
    current: 2000,
    deadline: '2024-04-01',
    color: '#FF5252',
    icon: 'tech',
    status: 'completed'
  }
];

// Consejos para alcanzar metas financieras
const financialTips = [
  "Automatiza tus ahorros destinando un porcentaje fijo de tus ingresos a tus metas.",
  "Divide tus grandes objetivos en metas más pequeñas y alcanzables.",
  "Celebra los hitos importantes en tu progreso, no solo el objetivo final.",
  "Revisa y ajusta tus metas financieras cada 3-6 meses según cambien tus circunstancias.",
  "Considera ingresos adicionales para acelerar el cumplimiento de tus metas."
];

export default function FinancialGoalsPage() {
  const [goals, setGoals] = useState(mockGoals);
  const [showForm, setShowForm] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '',
    deadline: '',
    color: '#00E676',
    icon: 'emergency',
  });
  
  // Cálculo de estadísticas generales
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.current, 0);
  const overallProgress = Math.round((totalCurrentAmount / totalTargetAmount) * 100);
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentGoal) {
      // Actualizar meta existente
      setGoals(goals.map(goal => 
        goal.id === currentGoal.id ? 
        {...goal, ...formData, current: parseFloat(formData.current), target: parseFloat(formData.target)} : 
        goal
      ));
    } else {
      // Crear nueva meta
      setGoals([
        ...goals, 
        {
          id: Date.now(),
          ...formData,
          current: parseFloat(formData.current),
          target: parseFloat(formData.target),
          status: 'in_progress'
        }
      ]);
    }
    resetForm();
  };
  
  const handleEdit = (goal) => {
    setCurrentGoal(goal);
    setFormData({
      name: goal.name,
      target: goal.target,
      current: goal.current,
      deadline: goal.deadline,
      color: goal.color,
      icon: goal.icon,
    });
    setShowForm(true);
  };
  
  const handleDelete = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  const handleComplete = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? 
      {...goal, status: goal.status === 'completed' ? 'in_progress' : 'completed'} : 
      goal
    ));
  };
  
  const resetForm = () => {
    setShowForm(false);
    setCurrentGoal(null);
    setFormData({
      name: '',
      target: '',
      current: '',
      deadline: '',
      color: '#00E676',
      icon: 'emergency',
    });
  };
  
  // Selector de iconos para las metas financieras
  const icons = {
    emergency: <FaRegLightbulb className="w-6 h-6" />,
    travel: <FaRegCalendarAlt className="w-6 h-6" />,
    home: <FaHome className="w-6 h-6" />,
    tech: <FaLaptop className="w-6 h-6" />,
    general: <FaBullseye className="w-6 h-6" />
  };
  
  // Obtener un consejo aleatorio
  const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">Metas Financieras</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center px-4 py-2 bg-[#00E676] text-gray-900 rounded-lg hover:bg-opacity-80 transition-all"
          >
            <FaPlus className="mr-2" /> Nueva Meta
          </button>
        </div>
        
        {/* Resumen de metas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700"
          >
            <p className="text-gray-400 text-sm">Total de Metas</p>
            <h3 className="text-3xl font-bold text-white mt-2">{goals.length}</h3>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700"
          >
            <p className="text-gray-400 text-sm">Progreso General</p>
            <h3 className="text-3xl font-bold text-white mt-2">{overallProgress}%</h3>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700"
          >
            <p className="text-gray-400 text-sm">Metas Completadas</p>
            <h3 className="text-3xl font-bold text-white mt-2">{completedGoals}</h3>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700"
          >
            <p className="text-gray-400 text-sm">Total Ahorrado</p>
            <h3 className="text-3xl font-bold text-white mt-2">${totalCurrentAmount.toLocaleString()}</h3>
          </motion.div>
        </div>
        
        {/* Consejo financiero */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#00E676] bg-opacity-10 border border-[#00E676] rounded-xl p-4 mb-8"
        >
          <div className="flex items-start">
            <FaRegLightbulb className="text-[#00E676] mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-white">Consejo del día</h3>
              <p className="text-gray-300 mt-1">{randomTip}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Formulario para crear/editar metas */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              {currentGoal ? 'Editar Meta' : 'Crear Nueva Meta'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre de la meta
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
                    Monto objetivo
                  </label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Monto actual
                  </label>
                  <input
                    type="number"
                    value={formData.current}
                    onChange={(e) => setFormData({...formData, current: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha límite
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    required
                  />
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
                    <option value="emergency">Emergencia</option>
                    <option value="travel">Viaje</option>
                    <option value="home">Casa</option>
                    <option value="tech">Tecnología</option>
                    <option value="general">General</option>
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
                  {currentGoal ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Lista de metas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = Math.round((goal.current / goal.target) * 100);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`bg-gray-800 rounded-xl overflow-hidden border ${goal.status === 'completed' ? 'border-[#00E676]' : 'border-gray-700'}`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: goal.color }}
                      >
                        {icons[goal.icon] || <FaBullseye className="w-5 h-5 text-gray-900" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-lg">{goal.name}</h3>
                        <p className="text-gray-400 text-sm">
                          Objetivo: ${goal.target.toLocaleString()} • Fecha: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleComplete(goal.id)}
                        className={`p-2 rounded-full ${goal.status === 'completed' ? 'bg-[#00E676] text-gray-900' : 'bg-gray-700 text-gray-300'}`}
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(goal)}
                        className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-red-700 hover:text-white"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">${goal.current.toLocaleString()}</span>
                      <span className="text-gray-300">${goal.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ width: `${progress}%`, backgroundColor: goal.color }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-400">Progreso</span>
                      <span className="text-sm font-medium" style={{ color: goal.color }}>{progress}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {goals.length === 0 && (
          <div className="text-center py-12">
            <FaBullseye className="mx-auto text-gray-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No has creado metas financieras</h3>
            <p className="text-gray-400">Las metas financieras te ayudan a planificar y alcanzar tus objetivos a largo plazo.</p>
            <button 
              onClick={() => setShowForm(true)} 
              className="mt-4 px-4 py-2 bg-[#00E676] text-gray-900 rounded-lg hover:bg-opacity-80"
            >
              Crear tu primera meta
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 