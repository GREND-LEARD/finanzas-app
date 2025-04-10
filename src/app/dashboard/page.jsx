'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/auth-store';
import {
  useTransactions,
  useAddTransaction,
  useUpdateTransaction,
  useDeleteTransaction
} from '../../lib/hooks/use-transactions';
import { useCategories } from '../../lib/hooks/use-categories';
import { formatCurrency } from '../../lib/utils/format';
import TransactionsTable from '../../components/dashboard/TransactionsTable';
import AnimatedStatsCard from '../../components/dashboard/AnimatedStatsCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TransactionForm from '../../components/forms/TransactionForm';
import ExpensePieChart from '../../components/charts/ExpensePieChart';
import TransactionLineChart from '../../components/charts/TransactionLineChart';
import FinancialAreaChart from '../../components/charts/FinancialAreaChart';
import DemoNotifications from '../../components/dashboard/DemoNotifications';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import StatsCardSkeleton from '../../components/skeletons/StatsCardSkeleton';
import ChartSkeleton from '../../components/skeletons/ChartSkeleton';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [chartView, setChartView] = useState('line'); // Opciones: 'line', 'area', 'pie'
  
  const {
    data: transactionsResult, // Renombramos para claridad
    isLoading: transactionsLoading,
    refetch: refetchTransactions
  } = useTransactions();
  
  // Extraemos el array de transacciones del resultado, con valor por defecto
  const transactions = transactionsResult?.data || [];
  
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useCategories();

  // Inicializar los hooks de mutación
  const addTransactionMutation = useAddTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();
  
  // Combinar estados de carga de mutaciones para el formulario
  const isMutating = addTransactionMutation.isPending || updateTransactionMutation.isPending;
  
  // --- Calcular fecha límite (últimos 30 días) ---
  const thirtyDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }, []);
  // --- Fin fecha límite ---

  // Calcular estadísticas (usando transacciones de los últimos 30 días)
  const statistics = React.useMemo(() => {
    // Primero, filtrar las transacciones para incluir solo las de los últimos 30 días
    const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
    
    if (!recentTransactions.length) return { income: 0, expenses: 0, balance: 0 };
    
    // Calcular sobre las transacciones filtradas
    const income = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions, thirtyDaysAgo]);

  // Calcular cambios porcentuales (simulados, sin cambios)
  const percentChanges = {
    income: 12.5,   // 12.5% más de ingresos que el período anterior
    expenses: -3.2, // 3.2% menos de gastos que el período anterior
    balance: 18.7   // 18.7% mejor balance que el período anterior
  };

  // Datos para el gráfico de pastel (últimos 30 días)
  const pieChartData = React.useMemo(() => {
    // Filtrar transacciones primero
    const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
    
    if (!recentTransactions.length) return [];

    const expensesByCategory = {};
    
    recentTransactions // Usar transacciones filtradas
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const categoryName = transaction.categories?.name || 'Sin categoría'; // Usar nombre si existe
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = 0;
        }
        expensesByCategory[categoryName] += Math.abs(transaction.amount);
      });

    return Object.keys(expensesByCategory).map(category => ({
      name: category,
      value: expensesByCategory[category]
    }));
  }, [transactions, thirtyDaysAgo]); // Añadir thirtyDaysAgo a dependencias

  // Datos para el gráfico de líneas (últimos 30 días)
  const lineChartData = React.useMemo(() => {
     // Filtrar transacciones primero
    const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);

    if (!recentTransactions.length) return [];

    const groupedByDate = {};
    
    recentTransactions.forEach(transaction => { // Usar transacciones filtradas
      // Usar solo la fecha sin la hora
      const date = transaction.date.split('T')[0];
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date: new Date(date),
          income: 0,
          expense: 0,
          balance: 0
        };
      }
      
      if (transaction.type === 'income') {
        groupedByDate[date].income += transaction.amount;
      } else {
        groupedByDate[date].expense += Math.abs(transaction.amount);
      }
      
      groupedByDate[date].balance = groupedByDate[date].income - groupedByDate[date].expense;
    });

    return Object.values(groupedByDate)
      .sort((a, b) => a.date - b.date)
      // Ya no necesitamos .slice(-30) aquí porque ya filtramos por fecha
      ; 
  }, [transactions, thirtyDaysAgo]); // Añadir thirtyDaysAgo a dependencias
  
  const handleSaveTransaction = async (formData) => {
    // Usar una promesa para manejar los toasts de carga/éxito/error
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (selectedTransaction) {
          // Actualizar
          await updateTransactionMutation.mutateAsync({ id: selectedTransaction.id, ...formData });
          resolve('Transacción actualizada con éxito');
        } else {
          // Crear
          await addTransactionMutation.mutateAsync(formData);
          resolve('Transacción creada con éxito');
        }
        // Cerrar formulario en éxito
        setShowForm(false);
        setSelectedTransaction(null);
      } catch (error) {
        console.error('Error al guardar:', error);
        // Rechazar la promesa con un mensaje de error específico
        reject(error.message || 'No se pudo guardar la transacción'); 
      }
    });

    // Mostrar notificación toast basada en la promesa
    toast.promise(promise, {
      loading: 'Guardando transacción...',
      success: (message) => message, // Mensaje de resolve
      error: (errorMessage) => errorMessage, // Mensaje de reject
    });
  };
  
  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowForm(true);
  };
  
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      // Usar promesa para toast
      const promise = new Promise(async (resolve, reject) => {
        try {
          await deleteTransactionMutation.mutateAsync(id);
          resolve('Transacción eliminada con éxito');
        } catch (error) {
          console.error('Error al eliminar:', error);
          reject(error.message || 'No se pudo eliminar la transacción');
        }
      });

      toast.promise(promise, {
        loading: 'Eliminando transacción...',
        success: (message) => message,
        error: (errorMessage) => errorMessage,
      });
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6 text-white">Dashboard Financiero</h1>
        
        {/* Resumen financiero - Conditionally render skeletons or cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {transactionsLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <AnimatedStatsCard
                title="Ingresos"
                value={formatCurrency(statistics.income)}
                percentChange={percentChanges.income}
                color="primary"
                delay={0}
                icon={() => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              />
              <AnimatedStatsCard
                title="Gastos"
                value={formatCurrency(statistics.expenses)}
                percentChange={percentChanges.expenses}
                color="red"
                delay={0.2}
                icon={() => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                )}
              />
              <AnimatedStatsCard
                title="Balance"
                value={formatCurrency(statistics.balance)}
                percentChange={percentChanges.balance}
                color={statistics.balance >= 0 ? 'primary' : 'red'}
                delay={0.4}
                icon={() => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
              />
            </>
          )}
        </div>
        
        {/* Gráficos con selector de tipo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="Gastos por Categoría (Últimos 30 días)" className="bg-gray-900/60 border-gray-800 shadow-xl">
            {transactionsLoading ? (
              <ChartSkeleton className="h-[300px]" />
            ) : (
              <ExpensePieChart data={pieChartData} />
            )}
          </Card>
          
          <Card title="Tendencia Financiera (Últimos 30 días)" className="bg-gray-900/60 border-gray-800 shadow-xl">
            {transactionsLoading ? (
              <ChartSkeleton className="h-[300px]" />
            ) : (
              <>
                <div className="mb-4 flex justify-end">
                  <div className="inline-flex bg-gray-800 rounded-md p-1">
                    <button 
                      onClick={() => setChartView('line')} 
                      className={`px-4 py-1 text-sm rounded-md transition-all ${chartView === 'line' ? 'bg-[#00E676] text-black font-medium' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      Línea
                    </button>
                    <button 
                      onClick={() => setChartView('area')} 
                      className={`px-4 py-1 text-sm rounded-md transition-all ${chartView === 'area' ? 'bg-[#00E676] text-black font-medium' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      Área
                    </button>
                  </div>
                </div>
                {chartView === 'line' ? (
                  <TransactionLineChart data={lineChartData} />
                ) : (
                  <FinancialAreaChart data={lineChartData} />
                )}
              </>
            )}
          </Card>
        </div>
        
        {/* Transacciones recientes */}
        <Card title="Transacciones Recientes" className="mb-8 bg-gray-900/60 border-gray-800 shadow-xl">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Historial de transacciones</h3>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <Link href="/dashboard/transactions" className="text-sm flex items-center text-[#00E676] hover:text-[#69F0AE]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver todas
              </Link>
              <Button
                onClick={() => {
                  setSelectedTransaction(null);
                  setShowForm(!showForm);
                }}
                variant={showForm ? "outline" : "primary"}
                className={showForm ? "border-[#00E676] text-[#00E676]" : "bg-[#00E676] text-gray-900 hover:bg-[#69F0AE]"}
              >
                {showForm ? 'Cancelar' : 'Agregar Transacción'}
              </Button>
            </div>
          </div>
          
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-gray-800/60 rounded-lg border border-gray-700"
            >
              <h4 className="text-lg font-medium mb-4 text-white">
                {selectedTransaction ? 'Editar' : 'Agregar'} Transacción
              </h4>
              <TransactionForm
                onSubmit={handleSaveTransaction}
                categories={categories}
                isLoading={isMutating}
                isEditing={!!selectedTransaction}
                defaultValues={selectedTransaction || {}}
              />
            </motion.div>
          )}
          
          {/* Log para depurar las transacciones pasadas a la tabla */}
          {console.log('DashboardPage - Transactions being passed to table:', transactions)}
          
          <TransactionsTable
            transactions={Array.isArray(transactions) ? transactions.slice(0, 5) : []}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            isLoading={transactionsLoading || deleteTransactionMutation.isPending}
          />
          
          {Array.isArray(transactions) && transactions.length > 5 && (
            <div className="mt-4 text-center">
              <Link href="/dashboard/transactions" className="text-sm text-[#00E676] hover:text-[#69F0AE]">
                Ver todas las transacciones
              </Link>
            </div>
          )}
        </Card>
        
        {/* Panel de demostración de notificaciones */}
        <DemoNotifications />
      </div>
    </motion.div>
  );
} 