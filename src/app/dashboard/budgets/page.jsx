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
import toast from 'react-hot-toast';

// Hooks de datos
import { 
  useBudgets, 
  useAddBudget, 
  useUpdateBudget, 
  useDeleteBudget 
} from '../../../lib/hooks/use-budgets';
import { useCategories } from '../../../lib/hooks/use-categories';

// Componentes UI
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
// Importar el formulario
import BudgetForm from '../../../components/forms/BudgetForm'; 
// import BudgetsList from '../../../components/dashboard/BudgetsList'; // Descomentar cuando se cree
// import BudgetCardSkeleton from '../../../components/skeletons/BudgetCardSkeleton';

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
  const [showForm, setShowForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Obtener presupuestos y categorías
  const { data: budgets = [], isLoading: isLoadingBudgets } = useBudgets();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  // Hooks de mutación (preparados para usar)
  const addMutation = useAddBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();

  const handleAddClick = () => {
    setSelectedBudget(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (budget) => {
    setSelectedBudget(budget);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) {
       toast.promise(
         deleteMutation.mutateAsync(id),
         {
           loading: 'Eliminando presupuesto...',
           success: 'Presupuesto eliminado con éxito',
           error: (err) => err.message || 'No se pudo eliminar el presupuesto'
         }
       );
    }
  };

  const handleSaveBudget = async (formData) => {
    const budgetData = {
      name: formData.name,
      amount: formData.amount, // Zod ya lo da como número
      category_id: formData.category_id,
      start_date: formData.start_date.toISOString().split('T')[0], // Formatear a YYYY-MM-DD para Supabase
      end_date: formData.end_date.toISOString().split('T')[0], // Formatear a YYYY-MM-DD para Supabase
    };

    const mutation = isEditing ? updateMutation : addMutation;
    const actionText = isEditing ? 'actualizar' : 'crear';
    const promise = mutation.mutateAsync(
      isEditing ? { id: selectedBudget.id, ...budgetData } : budgetData
    );

    toast.promise(promise, {
      loading: `${isEditing ? 'Actualizando' : 'Creando'} presupuesto...`,
      success: (result) => {
        setShowForm(false);
        setSelectedBudget(null); // Limpiar selección
        setIsEditing(false);
        return `Presupuesto ${actionText === 'actualizar' ? 'actualizado' : 'creado'} con éxito`;
      },
      error: (err) => {
        console.error(`Error al ${actionText} presupuesto:`, err);
        return err.message || `No se pudo ${actionText} el presupuesto`;
      }
    });
  };

  const isLoading = isLoadingBudgets || isLoadingCategories;
  const isMutating = addMutation.isPending || updateMutation.isPending;

  // Filtrar categorías de gasto para el formulario
  const expenseCategories = React.useMemo(() => 
    categories.filter(c => c.type === 'expense'), 
    [categories]
  );

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
  
  // Obtener estado del presupuesto (bajo, medio, excedido)
  const getBudgetStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'safe';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 bg-gray-900 min-h-screen text-white"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gestión de Presupuestos</h1>
        <Button onClick={handleAddClick} disabled={isLoadingCategories}> {/* Deshabilitar si no hay categorías cargadas */}
          {showForm ? 'Cancelar' : 'Agregar Presupuesto'} {/* Cambiar texto del botón */} 
        </Button>
      </div>

      {/* Área para el formulario (se mostrará condicionalmente) */}
      {showForm && (
        <Card className="mb-6 bg-gray-800/60 border border-gray-700">
          <h2 className="text-xl font-medium mb-4">
            {isEditing ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
          </h2>
          {/* Renderizar BudgetForm */}
          <BudgetForm 
            onSubmit={handleSaveBudget}
            categories={expenseCategories} 
            isLoading={isMutating}
            isEditing={isEditing}
            defaultValues={selectedBudget}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {/* Área para la lista de presupuestos */}
      <Card title="Mis Presupuestos" className="bg-gray-800/60 border border-gray-700">
        {isLoading ? (
          <p className="text-center py-10 text-gray-400">Cargando presupuestos...</p>
        ) : budgets.length === 0 ? (
          <p className="text-center py-10 text-gray-400">No has creado ningún presupuesto todavía.</p>
        ) : (
          <p className="text-center py-10 text-gray-400">[Lista de Presupuestos Aquí]</p>
        )}
      </Card>

    </motion.div>
  );
} 