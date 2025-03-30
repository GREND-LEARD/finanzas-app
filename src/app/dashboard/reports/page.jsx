'use client';

import React, { useState, useRef } from 'react';
import { 
  FaCalendarAlt, 
  FaFilePdf, 
  FaFileExcel, 
  FaFilter, 
  FaDownload, 
  FaEye,
  FaPrint
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Datos de ejemplo para los gráficos
const mockTransactionData = [
  { month: 'Ene', ingresos: 4500, gastos: 3200, ahorro: 1300 },
  { month: 'Feb', ingresos: 5200, gastos: 3800, ahorro: 1400 },
  { month: 'Mar', ingresos: 4800, gastos: 4000, ahorro: 800 },
  { month: 'Abr', ingresos: 5500, gastos: 3600, ahorro: 1900 },
  { month: 'May', ingresos: 4900, gastos: 3900, ahorro: 1000 },
  { month: 'Jun', ingresos: 5700, gastos: 4200, ahorro: 1500 },
  { month: 'Jul', ingresos: 5400, gastos: 4100, ahorro: 1300 },
  { month: 'Ago', ingresos: 5800, gastos: 4300, ahorro: 1500 },
  { month: 'Sep', ingresos: 6000, gastos: 4400, ahorro: 1600 },
  { month: 'Oct', ingresos: 6200, gastos: 4500, ahorro: 1700 },
  { month: 'Nov', ingresos: 6300, gastos: 4800, ahorro: 1500 },
  { month: 'Dic', ingresos: 7000, gastos: 5200, ahorro: 1800 },
];

const mockCategoryData = [
  { name: 'Alimentación', value: 1200, color: '#FF8042' },
  { name: 'Vivienda', value: 1800, color: '#0088FE' },
  { name: 'Transporte', value: 800, color: '#00C49F' },
  { name: 'Entretenimiento', value: 600, color: '#FFBB28' },
  { name: 'Servicios', value: 500, color: '#FF5252' },
  { name: 'Otros', value: 300, color: '#9370DB' },
];

// Datos de ejemplo para las transacciones en formato tabla
const mockTransactions = [
  { id: 1, fecha: '2023-12-01', descripcion: 'Salario', categoria: 'Ingresos', monto: 4500, tipo: 'ingreso' },
  { id: 2, fecha: '2023-12-03', descripcion: 'Supermercado', categoria: 'Alimentación', monto: 120, tipo: 'gasto' },
  { id: 3, fecha: '2023-12-05', descripcion: 'Alquiler', categoria: 'Vivienda', monto: 1200, tipo: 'gasto' },
  { id: 4, fecha: '2023-12-07', descripcion: 'Transporte público', categoria: 'Transporte', monto: 50, tipo: 'gasto' },
  { id: 5, fecha: '2023-12-10', descripcion: 'Cine', categoria: 'Entretenimiento', monto: 30, tipo: 'gasto' },
  { id: 6, fecha: '2023-12-12', descripcion: 'Electricidad', categoria: 'Servicios', monto: 80, tipo: 'gasto' },
  { id: 7, fecha: '2023-12-15', descripcion: 'Trabajo freelance', categoria: 'Ingresos', monto: 600, tipo: 'ingreso' },
  { id: 8, fecha: '2023-12-18', descripcion: 'Restaurante', categoria: 'Alimentación', monto: 75, tipo: 'gasto' },
  { id: 9, fecha: '2023-12-20', descripcion: 'Gasolina', categoria: 'Transporte', monto: 60, tipo: 'gasto' },
  { id: 10, fecha: '2023-12-22', descripcion: 'Internet', categoria: 'Servicios', monto: 70, tipo: 'gasto' },
  { id: 11, fecha: '2023-12-25', descripcion: 'Regalo', categoria: 'Otros', monto: 100, tipo: 'gasto' },
  { id: 12, fecha: '2023-12-30', descripcion: 'Bonus', categoria: 'Ingresos', monto: 300, tipo: 'ingreso' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: '2023-12-01', to: '2023-12-31' });
  const [chartType, setChartType] = useState('line');
  const [selectedCategories, setSelectedCategories] = useState(['Ingresos', 'Gastos', 'Ahorro']);
  const [reportView, setReportView] = useState('charts');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const reportRef = useRef(null);

  // Opciones para personalizar el reporte
  const chartTypes = [
    { id: 'line', name: 'Líneas', description: 'Ideal para tendencias de tiempo' },
    { id: 'bar', name: 'Barras', description: 'Compara valores entre categorías' },
    { id: 'area', name: 'Área', description: 'Muestra volumen a lo largo del tiempo' },
    { id: 'pie', name: 'Circular', description: 'Distribución proporcional' },
  ];

  const periods = [
    { id: 'daily', name: 'Diario' },
    { id: 'weekly', name: 'Semanal' },
    { id: 'monthly', name: 'Mensual' },
    { id: 'quarterly', name: 'Trimestral' },
    { id: 'yearly', name: 'Anual' },
  ];

  // Función para imprimir el reporte
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: 'Reporte_Financiero',
  });

  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Reporte Financiero', 14, 22);
    
    // Información del reporte
    doc.setFontSize(12);
    doc.text(`Período: ${dateRange.from} - ${dateRange.to}`, 14, 32);
    
    // Tabla de transacciones
    doc.autoTable({
      head: [['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto']],
      body: mockTransactions.map(t => [
        t.fecha, 
        t.descripcion, 
        t.categoria, 
        t.tipo === 'ingreso' ? 'Ingreso' : 'Gasto',
        `$${t.monto.toFixed(2)}`
      ]),
      startY: 40,
    });
    
    // Resumen
    const sumIngresos = mockTransactions
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);
    
    const sumGastos = mockTransactions
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0);
    
    const yPos = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.text('Resumen:', 14, yPos);
    doc.text(`Total Ingresos: $${sumIngresos.toFixed(2)}`, 14, yPos + 10);
    doc.text(`Total Gastos: $${sumGastos.toFixed(2)}`, 14, yPos + 20);
    doc.text(`Balance: $${(sumIngresos - sumGastos).toFixed(2)}`, 14, yPos + 30);
    
    doc.save('reporte_financiero.pdf');
  };
  
  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(mockTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones");
    
    // Crear una hoja para el resumen
    const sumIngresos = mockTransactions
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);
    
    const sumGastos = mockTransactions
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0);
    
    const summaryData = [
      { Concepto: 'Total Ingresos', Valor: sumIngresos },
      { Concepto: 'Total Gastos', Valor: sumGastos },
      { Concepto: 'Balance', Valor: sumIngresos - sumGastos }
    ];
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");
    
    XLSX.writeFile(workbook, "reporte_financiero.xlsx");
  };

  // Configurar los datos según el tipo de gráfico seleccionado
  const getChartData = () => {
    if (chartType === 'pie') {
      return mockCategoryData;
    }
    return mockTransactionData;
  };

  // Renderizar el gráfico seleccionado
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockTransactionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              {selectedCategories.includes('Ingresos') && (
                <Line type="monotone" dataKey="ingresos" stroke="#00E676" strokeWidth={2} activeDot={{ r: 8 }} />
              )}
              {selectedCategories.includes('Gastos') && (
                <Line type="monotone" dataKey="gastos" stroke="#FF5252" strokeWidth={2} activeDot={{ r: 8 }} />
              )}
              {selectedCategories.includes('Ahorro') && (
                <Line type="monotone" dataKey="ahorro" stroke="#64B5F6" strokeWidth={2} activeDot={{ r: 8 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mockTransactionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              {selectedCategories.includes('Ingresos') && (
                <Bar dataKey="ingresos" fill="#00E676" />
              )}
              {selectedCategories.includes('Gastos') && (
                <Bar dataKey="gastos" fill="#FF5252" />
              )}
              {selectedCategories.includes('Ahorro') && (
                <Bar dataKey="ahorro" fill="#64B5F6" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={mockTransactionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              {selectedCategories.includes('Ingresos') && (
                <Area type="monotone" dataKey="ingresos" fill="#00E676" fillOpacity={0.3} stroke="#00E676" strokeWidth={2} />
              )}
              {selectedCategories.includes('Gastos') && (
                <Area type="monotone" dataKey="gastos" fill="#FF5252" fillOpacity={0.3} stroke="#FF5252" strokeWidth={2} />
              )}
              {selectedCategories.includes('Ahorro') && (
                <Area type="monotone" dataKey="ahorro" fill="#64B5F6" fillOpacity={0.3} stroke="#64B5F6" strokeWidth={2} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={mockCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mockCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  // Renderizar la vista de tabla de transacciones
  const renderTransactionsTable = () => {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {mockTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.tipo === 'ingreso' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {transaction.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transaction.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.tipo === 'ingreso' ? '+' : '-'}${transaction.monto.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Renderizar el resumen financiero
  const renderSummary = () => {
    const totalIngresos = mockTransactions
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);
    
    const totalGastos = mockTransactions
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0);
    
    const balance = totalIngresos - totalGastos;
    const porcentajeAhorro = (balance / totalIngresos * 100).toFixed(1);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Ingresos</p>
              <h3 className="text-2xl font-bold text-green-400">${totalIngresos.toFixed(2)}</h3>
            </div>
            <span className="p-2 bg-green-900 rounded-lg text-green-300">
              <FaCalendarAlt />
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Gastos</p>
              <h3 className="text-2xl font-bold text-red-400">${totalGastos.toFixed(2)}</h3>
            </div>
            <span className="p-2 bg-red-900 rounded-lg text-red-300">
              <FaCalendarAlt />
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Balance</p>
              <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${balance.toFixed(2)}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {balance >= 0 
                  ? `Ahorro del ${porcentajeAhorro}% de ingresos` 
                  : `Déficit del ${Math.abs(porcentajeAhorro)}% sobre ingresos`}
              </p>
            </div>
            <span className={`p-2 rounded-lg ${balance >= 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              <FaCalendarAlt />
            </span>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reportes Personalizados</h1>
        <p className="text-gray-400">Genera reportes detallados de tus finanzas, con opciones de exportación y personalización.</p>
      </div>

      {/* Panel de filtros y controles */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Selector de rango de fechas */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Rango de fechas</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Selector de periodo */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Agrupar por</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de tipo de gráfico */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de visualización</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent"
            >
              {chartTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de categorías */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Datos a mostrar</label>
            <div className="flex flex-wrap gap-2">
              {['Ingresos', 'Gastos', 'Ahorro'].map((category) => (
                <label key={category} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      }
                    }}
                    className="form-checkbox h-4 w-4 text-[#00E676] rounded focus:ring-[#00E676] border-gray-600 bg-gray-700"
                  />
                  <span className="ml-2 mr-3 text-sm text-gray-300">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de vista */}
        <div className="flex flex-wrap justify-between items-center mt-6 pt-6 border-t border-gray-700">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            <button
              onClick={() => setReportView('charts')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
                reportView === 'charts' 
                  ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FaChartBar /> Gráficos
            </button>
            <button
              onClick={() => setReportView('table')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
                reportView === 'table' 
                  ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FaFilter /> Transacciones
            </button>
          </div>

          {/* Botones de exportación */}
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg flex items-center gap-2 text-sm"
            >
              <FaPrint /> Imprimir
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-red-800 text-white hover:bg-red-700 rounded-lg flex items-center gap-2 text-sm"
            >
              <FaFilePdf /> PDF
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-800 text-white hover:bg-green-700 rounded-lg flex items-center gap-2 text-sm"
            >
              <FaFileExcel /> Excel
            </button>
          </div>
        </div>
      </div>

      {/* Vista previa del reporte */}
      <div ref={reportRef} className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Vista previa del reporte</h2>
          <p className="text-gray-400 text-sm">
            Período: {dateRange.from} - {dateRange.to}
          </p>
        </div>

        {/* Resumen financiero */}
        {renderSummary()}

        {/* Vista seleccionada (gráficos o tabla) */}
        {reportView === 'charts' ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              {chartType === 'pie' ? 'Distribución de gastos por categoría' : 'Evolución de finanzas por mes'}
            </h3>
            {renderChart()}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Detalle de transacciones</h3>
            {renderTransactionsTable()}
          </div>
        )}
      </div>

      {/* Consejos y ayuda */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Consejos para tu reporte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-[#00E676]">
            <h3 className="text-white font-medium mb-2">Mejor formato para análisis detallado</h3>
            <p className="text-gray-300 text-sm">
              Exporta a Excel si necesitas realizar análisis adicionales o cálculos personalizados sobre tus datos financieros.
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-[#00E676]">
            <h3 className="text-white font-medium mb-2">Impresión o compartir</h3>
            <p className="text-gray-300 text-sm">
              Utiliza la exportación a PDF si deseas compartir tus reportes o guardarlos como documentos formales para referencia futura.
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-[#00E676]">
            <h3 className="text-white font-medium mb-2">Visualización efectiva</h3>
            <p className="text-gray-300 text-sm">
              Los gráficos de línea son ideales para ver tendencias a lo largo del tiempo, mientras que los gráficos circulares muestran mejor la distribución proporcional.
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-[#00E676]">
            <h3 className="text-white font-medium mb-2">Frecuencia recomendada</h3>
            <p className="text-gray-300 text-sm">
              Genera reportes mensuales para seguimiento regular, y reportes trimestrales o anuales para análisis de tendencias a largo plazo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 