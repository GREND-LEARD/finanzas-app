'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Componentes UI
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

// Importar la función y el store de auth
import { fetchAllFilteredTransactions } from '../../../lib/hooks/use-transactions';
import { useAuthStore } from '../../../lib/store/auth-store';

// Importar el gráfico
import IncomeExpenseChart from '../../../components/charts/IncomeExpenseChart';
// Importar el nuevo gráfico de distribución
import ExpenseDistributionChart from '../../../components/charts/ExpenseDistributionChart';
// Importar el nuevo gráfico de ingresos
import IncomeSourceChart from '../../../components/charts/IncomeSourceChart';

// Importar Skeletons
import StatsCardSkeleton from '../../../components/skeletons/StatsCardSkeleton';
import ChartSkeleton from '../../../components/skeletons/ChartSkeleton';

// Helpers de fecha
const getMonthDateRange = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  };
};

const getYearDateRange = (year) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  };
};

// Importar formateador de moneda si no está ya
const { formatCurrency } = require('../../../lib/utils/format'); 

export default function ReportsPage() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // Estado para el rango de fechas
  const [dateRange, setDateRange] = useState(getMonthDateRange(currentYear, currentMonth));
  const [selectedPreset, setSelectedPreset] = useState('thisMonth');
  
  // Estado para las transacciones y carga
  const [reportTransactions, setReportTransactions] = useState([]);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  
  // Usuario
  const { user } = useAuthStore();

  // useEffect para buscar transacciones
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !dateRange.start || !dateRange.end) {
        setReportTransactions([]); 
        return;
      }
      
      setIsLoadingReport(true);
      try {
        const filters = {
          dateFrom: dateRange.start,
          dateTo: dateRange.end,
        };
        const fetchedData = await fetchAllFilteredTransactions(user.id, filters);
        setReportTransactions(fetchedData);
      } catch (error) {
        console.error("Error fetching report transactions:", error);
        setReportTransactions([]); 
        toast.error(`Error al cargar datos: ${error.message}`);
      } finally {
        setIsLoadingReport(false);
      }
    };

    fetchData();
  }, [dateRange, user?.id]);

  // Handlers para cambio de fecha
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
    setSelectedPreset('custom');
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    switch (preset) {
      case 'thisMonth':
        setDateRange(getMonthDateRange(year, month));
        break;
      case 'lastMonth':
        const lastMonth = month === 1 ? 12 : month - 1;
        const yearOfLastMonth = month === 1 ? year - 1 : year;
        setDateRange(getMonthDateRange(yearOfLastMonth, lastMonth));
        break;
      case 'thisYear':
        setDateRange(getYearDateRange(year));
        break;
      case 'lastYear':
        setDateRange(getYearDateRange(year - 1));
        break;
      default:
        break;
    }
  };

  // Procesar datos para Gráfico Ingresos vs Gastos
  const incomeExpenseData = useMemo(() => {
    if (!reportTransactions || reportTransactions.length === 0) return [];
    const monthlyData = {};
    reportTransactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthlyData[monthKey].income += t.amount;
      } else if (t.type === 'expense') {
        monthlyData[monthKey].expense += Math.abs(t.amount);
      }
    });
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }, [reportTransactions]);

  // TODO: Procesar datos para Gráfico Distribución de Gastos
  const expenseDistributionData = useMemo(() => {
     if (!reportTransactions || reportTransactions.length === 0) return [];
     const expensesByCategory = {};
     reportTransactions.filter(t => t.type === 'expense').forEach(t => {
       const categoryName = t.categories?.name || 'Sin Categoría';
       if (!expensesByCategory[categoryName]) {
         expensesByCategory[categoryName] = 0;
       }
       expensesByCategory[categoryName] += Math.abs(t.amount);
     });
     return Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  }, [reportTransactions]);

  console.log("Datos Ingresos/Gastos:", incomeExpenseData);
  console.log("Datos Distribución Gastos:", expenseDistributionData);

  // --- Procesar datos para Gráfico Fuentes de Ingresos ---
  const incomeSourceData = useMemo(() => {
    if (!reportTransactions || reportTransactions.length === 0) return [];
    const incomeByCategory = {};
    reportTransactions.filter(t => t.type === 'income').forEach(t => {
      const categoryName = t.categories?.name || 'Sin Categoría'; // Usar nombre real
      if (!incomeByCategory[categoryName]) {
        incomeByCategory[categoryName] = 0;
      }
      incomeByCategory[categoryName] += t.amount; // Sumar monto (ya es positivo)
    });
    // Formato para recharts PieChart: { name: 'CategoryName', value: 123 }
    return Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }));
  }, [reportTransactions]);
  // --- Fin procesamiento de datos ---

  console.log("Datos Fuentes Ingresos:", incomeSourceData);

  // --- Calcular Estadísticas Resumen para el periodo ---
  const summaryStats = useMemo(() => {
    if (!reportTransactions || reportTransactions.length === 0) {
      return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    }

    const totalIncome = reportTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = reportTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses
    };
  }, [reportTransactions]);
  // --- Fin cálculo de estadísticas ---

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 bg-gray-900 min-h-screen text-white space-y-6"
    >
      <h1 className="text-2xl font-semibold">Reportes Financieros</h1>

      {/* Controles de Rango de Fechas (Cleaned) */}
      <Card className="bg-gray-800/60 border border-gray-700 p-4">
        <h2 className="text-lg font-medium mb-3">Seleccionar Periodo</h2>
        <div className="flex flex-wrap items-end gap-4">
          {/* Presets */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={selectedPreset === 'thisMonth' ? 'primary' : 'outline'}
              onClick={() => handlePresetChange('thisMonth')}
              size="sm"
              disabled={isLoadingReport} 
            >
              Mes Actual
            </Button>
             <Button 
              variant={selectedPreset === 'lastMonth' ? 'primary' : 'outline'}
              onClick={() => handlePresetChange('lastMonth')}
              size="sm"
              disabled={isLoadingReport}
            >
              Mes Pasado
            </Button>
            <Button 
              variant={selectedPreset === 'thisYear' ? 'primary' : 'outline'}
              onClick={() => handlePresetChange('thisYear')}
              size="sm"
              disabled={isLoadingReport}
            >
              Año Actual
            </Button>
            <Button 
              variant={selectedPreset === 'lastYear' ? 'primary' : 'outline'}
              onClick={() => handlePresetChange('lastYear')}
              size="sm"
              disabled={isLoadingReport}
            >
              Año Pasado
            </Button>
          </div>
          {/* Rango Personalizado */}
          <div className="flex gap-2 items-end">
             <Input
              label="Desde"
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateChange}
              className="bg-gray-700"
              disabled={isLoadingReport}
            />
             <Input
              label="Hasta"
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateChange}
              className="bg-gray-700"
              disabled={isLoadingReport}
            />
          </div>
        </div>
      </Card>

      {/* Área de Resumen, Gráficos y Tablas */}
      {isLoadingReport ? (
        // Mostrar esqueletos mientras carga
        <div className="space-y-6">
          {/* Skeletons para las tarjetas resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
          {/* Skeletons para los gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartSkeleton className="h-[300px]" />
            <ChartSkeleton className="h-[300px]" />
            <ChartSkeleton className="h-[300px]" />
          </div>
        </div>
      ) : (
        // Mostrar contenido real cuando no está cargando
        <div className="space-y-6">
          {/* Área de Resumen */}
          {reportTransactions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="p-4 bg-gray-800/60 border border-gray-700">
                 <p className="text-sm text-gray-400 mb-1">Total Ingresos</p>
                 <p className="text-xl font-bold text-green-400">{formatCurrency(summaryStats.totalIncome)}</p>
               </Card>
                <Card className="p-4 bg-gray-800/60 border border-gray-700">
                 <p className="text-sm text-gray-400 mb-1">Total Gastos</p>
                 <p className="text-xl font-bold text-red-400">{formatCurrency(summaryStats.totalExpenses)}</p>
               </Card>
                <Card className="p-4 bg-gray-800/60 border border-gray-700">
                 <p className="text-sm text-gray-400 mb-1">Ahorro Neto / Déficit</p>
                 <p className={`text-xl font-bold ${summaryStats.netBalance >= 0 ? 'text-white' : 'text-red-400'}`}>
                   {formatCurrency(summaryStats.netBalance)}
                 </p>
               </Card>
            </div>
          )}

          {/* Área de Gráficos */}
          {reportTransactions.length > 0 || incomeExpenseData.length > 0 || expenseDistributionData.length > 0 || incomeSourceData.length > 0 ? (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="Ingresos vs. Gastos" className="bg-gray-800/60 border border-gray-700">
                {incomeExpenseData.length > 0 ? (
                  <IncomeExpenseChart data={incomeExpenseData} /> 
                ) : (
                  <p className="text-center py-20 text-gray-500">No hay datos</p>
                )}
              </Card>
              <Card title="Distribución de Gastos" className="bg-gray-800/60 border border-gray-700">
                {expenseDistributionData.length > 0 ? (
                  <ExpenseDistributionChart data={expenseDistributionData} /> 
                ) : (
                  <p className="text-center py-20 text-gray-500">No hay gastos</p>
                )}
              </Card>
              <Card title="Fuentes de Ingresos" className="bg-gray-800/60 border border-gray-700">
                {incomeSourceData.length > 0 ? (
                  <IncomeSourceChart data={incomeSourceData} /> 
                ) : (
                  <p className="text-center py-20 text-gray-500">No hay ingresos</p>
                )}
              </Card>
            </div>
          ) : (
            // Mensaje si no hay absolutamente nada después de cargar
            <p className="text-center py-10 text-gray-400">No se encontraron datos para el periodo seleccionado.</p>
          )}
        </div>
      )}

    </motion.div>
  );
} 