'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { FaFilter, FaDownload, FaChartPie, FaChartLine, FaChartBar, FaCalendarAlt } from 'react-icons/fa';

// Datos simulados para los gráficos de análisis financiero
const monthlyData = [
  { month: 'Ene', ingresos: 4000, gastos: 2400, ahorros: 1600 },
  { month: 'Feb', ingresos: 3500, gastos: 2800, ahorros: 700 },
  { month: 'Mar', ingresos: 3800, gastos: 2100, ahorros: 1700 },
  { month: 'Abr', ingresos: 4200, gastos: 3000, ahorros: 1200 },
  { month: 'May', ingresos: 4500, gastos: 3200, ahorros: 1300 },
  { month: 'Jun', ingresos: 4100, gastos: 2900, ahorros: 1200 },
  { month: 'Jul', ingresos: 5000, gastos: 3800, ahorros: 1200 },
  { month: 'Ago', ingresos: 4800, gastos: 3600, ahorros: 1200 },
  { month: 'Sep', ingresos: 5200, gastos: 3900, ahorros: 1300 },
  { month: 'Oct', ingresos: 5500, gastos: 4100, ahorros: 1400 },
  { month: 'Nov', ingresos: 6000, gastos: 4500, ahorros: 1500 },
  { month: 'Dic', ingresos: 7000, gastos: 5200, ahorros: 1800 },
];

const categoryExpenseData = [
  { name: 'Alimentación', value: 1200, color: '#00E676' },
  { name: 'Vivienda', value: 2500, color: '#64B5F6' },
  { name: 'Transporte', value: 800, color: '#FFD54F' },
  { name: 'Entretenimiento', value: 600, color: '#FF5252' },
  { name: 'Servicios', value: 450, color: '#BA68C8' },
  { name: 'Otros', value: 550, color: '#4DB6AC' },
];

const weeklyExpenseData = [
  { day: 'Lun', value: 120 },
  { day: 'Mar', value: 180 },
  { day: 'Mié', value: 150 },
  { day: 'Jue', value: 220 },
  { day: 'Vie', value: 350 },
  { day: 'Sáb', value: 280 },
  { day: 'Dom', value: 200 },
];

const incomeSourceData = [
  { name: 'Salario', value: 4500, color: '#00E676' },
  { name: 'Inversiones', value: 800, color: '#64B5F6' },
  { name: 'Freelance', value: 1200, color: '#FFD54F' },
  { name: 'Otros', value: 500, color: '#4DB6AC' },
];

// Insights generados a partir de los datos (simulados)
const insights = [
  {
    title: 'Gastos por encima del promedio',
    description: 'Tus gastos de Entretenimiento aumentaron un 23% este mes respecto al promedio de los últimos 3 meses.',
    action: 'Considera establecer un presupuesto específico para esta categoría.',
    type: 'warning'
  },
  {
    title: 'Buena tendencia de ahorro',
    description: 'Has mantenido un ratio de ahorro superior al 20% durante los últimos 5 meses.',
    action: 'Considera invertir parte de estos ahorros para generar rendimientos.',
    type: 'positive'
  },
  {
    title: 'Oportunidad de optimización',
    description: 'Tus gastos en Servicios han aumentado gradualmente en los últimos meses.',
    action: 'Revisa tus suscripciones y servicios para identificar posibles ahorros.',
    type: 'tip'
  }
];

export default function FinancialAnalysisPage() {
  const [timeRange, setTimeRange] = useState('year');
  const [chartType, setChartType] = useState('overview');
  const [showInsights, setShowInsights] = useState(true);
  
  // Función para exportar datos (simulada)
  const handleExportData = () => {
    alert('Exportación de datos iniciada. El archivo se descargará en breve.');
  };
  
  // Renderizar el gráfico apropiado según la selección del usuario
  const renderChart = () => {
    switch (chartType) {
      case 'overview':
        return (
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Resumen Financiero</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', borderColor: '#444' }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Legend wrapperStyle={{ color: 'white' }} />
                  <Bar dataKey="ingresos" name="Ingresos" fill="#00E676" />
                  <Bar dataKey="gastos" name="Gastos" fill="#FF5252" />
                  <Bar dataKey="ahorros" name="Ahorros" fill="#64B5F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'expense':
        return (
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Distribución de Gastos</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Monto']}
                    contentStyle={{ backgroundColor: '#333', borderColor: '#444', color: 'white' }}
                  />
                  <Legend formatter={(value) => <span style={{ color: 'white' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'income':
        return (
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Fuentes de Ingresos</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Monto']}
                    contentStyle={{ backgroundColor: '#333', borderColor: '#444', color: 'white' }}
                  />
                  <Legend formatter={(value) => <span style={{ color: 'white' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'trends':
        return (
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Tendencias de Ingresos y Gastos</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', borderColor: '#444' }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Legend wrapperStyle={{ color: 'white' }} />
                  <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="#00E676" strokeWidth={2} />
                  <Line type="monotone" dataKey="gastos" name="Gastos" stroke="#FF5252" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'savings':
        return (
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Tendencia de Ahorros</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorAhorros" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64B5F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#64B5F6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', borderColor: '#444' }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ahorros" 
                    name="Ahorros" 
                    stroke="#64B5F6" 
                    fillOpacity={1} 
                    fill="url(#colorAhorros)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'weekly':
        return (
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Gastos Semanales</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyExpenseData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="day" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', borderColor: '#444' }}
                    labelStyle={{ color: 'white' }}
                    formatter={(value) => [`$${value}`, 'Gasto']}
                  />
                  <Bar dataKey="value" name="Gastos" fill="#FF5252" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-semibold text-white mb-4 md:mb-0">Análisis Financiero</h1>
          
          <div className="flex flex-wrap gap-3">
            {/* Filtro de periodo de tiempo */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="month">Este Mes</option>
                <option value="quarter">Último Trimestre</option>
                <option value="halfyear">Último Semestre</option>
                <option value="year">Último Año</option>
                <option value="custom">Personalizado</option>
              </select>
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Botón de exportar datos */}
            <button 
              onClick={handleExportData}
              className="px-4 py-2 flex items-center bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700"
            >
              <FaDownload className="mr-2" /> Exportar
            </button>
          </div>
        </div>
        
        {/* Paneles de análisis */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <button
            onClick={() => setChartType('overview')}
            className={`p-3 rounded-lg flex flex-col items-center justify-center ${
              chartType === 'overview' ? 'bg-[#00E676] text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FaChartBar className="w-5 h-5 mb-1" />
            <span className="text-sm">Resumen</span>
          </button>
          
          <button
            onClick={() => setChartType('expense')}
            className={`p-3 rounded-lg flex flex-col items-center justify-center ${
              chartType === 'expense' ? 'bg-[#00E676] text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FaChartPie className="w-5 h-5 mb-1" />
            <span className="text-sm">Gastos</span>
          </button>
          
          <button
            onClick={() => setChartType('income')}
            className={`p-3 rounded-lg flex flex-col items-center justify-center ${
              chartType === 'income' ? 'bg-[#00E676] text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FaChartPie className="w-5 h-5 mb-1" />
            <span className="text-sm">Ingresos</span>
          </button>
          
          <button
            onClick={() => setChartType('trends')}
            className={`p-3 rounded-lg flex flex-col items-center justify-center ${
              chartType === 'trends' ? 'bg-[#00E676] text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FaChartLine className="w-5 h-5 mb-1" />
            <span className="text-sm">Tendencias</span>
          </button>
          
          <button
            onClick={() => setChartType('savings')}
            className={`p-3 rounded-lg flex flex-col items-center justify-center ${
              chartType === 'savings' ? 'bg-[#00E676] text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FaChartLine className="w-5 h-5 mb-1" />
            <span className="text-sm">Ahorros</span>
          </button>
          
          <button
            onClick={() => setChartType('weekly')}
            className={`p-3 rounded-lg flex flex-col items-center justify-center ${
              chartType === 'weekly' ? 'bg-[#00E676] text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FaChartBar className="w-5 h-5 mb-1" />
            <span className="text-sm">Semanal</span>
          </button>
        </div>
        
        {/* Gráfico principal */}
        {renderChart()}
        
        {/* Insights financieros */}
        {showInsights && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Insights Financieros</h2>
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Ocultar
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-gray-800 rounded-xl p-5 border ${
                    insight.type === 'warning' ? 'border-[#FFD54F]' : 
                    insight.type === 'positive' ? 'border-[#00E676]' : 
                    'border-[#64B5F6]'
                  }`}
                >
                  <h3 className={`font-medium mb-2 ${
                    insight.type === 'warning' ? 'text-[#FFD54F]' : 
                    insight.type === 'positive' ? 'text-[#00E676]' : 
                    'text-[#64B5F6]'
                  }`}>
                    {insight.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                  <p className="text-gray-400 text-xs italic">{insight.action}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Detalles adicionales */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Métricas Clave</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Ratio de Ahorro</span>
                  <span className="text-[#00E676] font-medium">24%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[#00E676] h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Ratio de Gastos Fijos</span>
                  <span className="text-[#64B5F6] font-medium">58%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[#64B5F6] h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Ratio de Gastos Variables</span>
                  <span className="text-[#FFD54F] font-medium">18%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[#FFD54F] h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Crecimiento Anual de Ingresos</span>
                  <span className="text-[#00E676] font-medium">14%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[#00E676] h-2 rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Comparativa Año Anterior</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ingresos</span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">$53,400</span>
                  <span className="text-[#00E676] text-sm">+12%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Gastos</span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">$39,500</span>
                  <span className="text-[#FF5252] text-sm">+8%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ahorros</span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">$13,900</span>
                  <span className="text-[#00E676] text-sm">+24%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ratio de Ahorro</span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">26%</span>
                  <span className="text-[#00E676] text-sm">+2%</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 my-4"></div>
              
              <div className="text-center pt-2">
                <p className="text-gray-300 text-sm">
                  Has mejorado tu situación financiera respecto al año anterior. 
                  Sigue así para alcanzar tus objetivos a largo plazo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 