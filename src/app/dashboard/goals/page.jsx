'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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

// Hooks de datos
import { 
  useFinancialGoals, 
  useAddFinancialGoal, 
  useUpdateFinancialGoal, 
  useDeleteFinancialGoal 
} from '../../../lib/hooks/use-financial-goals';

// Componentes UI
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import GoalForm from '../../../components/forms/GoalForm';
// Importar la lista
import GoalsList from '../../../components/dashboard/GoalsList'; 

export default function FinancialGoalsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Obtener metas
  const { data: goals = [], isLoading: isLoadingGoals } = useFinancialGoals();

  // Hooks de mutación
  const addMutation = useAddFinancialGoal();
  const updateMutation = useUpdateFinancialGoal();
  const deleteMutation = useDeleteFinancialGoal();

  const handleAddClick = () => {
    setSelectedGoal(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (goal) => {
    setSelectedGoal(goal);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta meta financiera?')) {
       toast.promise(
         deleteMutation.mutateAsync(id),
         {
           loading: 'Eliminando meta...',
           success: 'Meta eliminada con éxito',
           error: (err) => err.message || 'No se pudo eliminar la meta'
         }
       );
    }
  };

  const handleSaveGoal = async (formData) => {
    // Datos ya vienen con tipos correctos desde el form/Zod
    // El hook addFinancialGoal manejará current_amount=0 si es undefined
    const goalData = {
      name: formData.name,
      target_amount: formData.target_amount,
      current_amount: formData.current_amount, // Puede ser undefined, el hook lo maneja
      target_date: formData.target_date, // Puede ser null o Date
    };

    const mutation = isEditing ? updateMutation : addMutation;
    const actionText = isEditing ? 'actualizar' : 'crear';
    const promise = mutation.mutateAsync(
      isEditing ? { id: selectedGoal.id, ...goalData } : goalData
    );

    toast.promise(promise, {
      loading: `${isEditing ? 'Actualizando' : 'Creando'} meta...`,
      success: (result) => {
        setShowForm(false);
        setSelectedGoal(null);
        setIsEditing(false);
        return `Meta ${actionText === 'actualizar' ? 'actualizada' : 'creada'} con éxito`;
      },
      error: (err) => {
        console.error(`Error al ${actionText} meta:`, err);
        return err.message || `No se pudo ${actionText} la meta`;
      }
    });
  };

  // --- Función para actualizar el progreso (current_amount) ---
  const handleUpdateProgress = async (goalId, newCurrentAmount) => {
    const goalToUpdate = goals.find(g => g.id === goalId);
    if (!goalToUpdate) return; // Seguridad

    // Validar que no pasemos del target si ya está completada? (Opcional)
    // if (goalToUpdate.status === 'completed' && newCurrentAmount > goalToUpdate.target_amount) {
    //   toast.error('La meta ya está completada.');
    //   return;
    // }

    const promise = updateMutation.mutateAsync({
      id: goalId,
      current_amount: newCurrentAmount,
    });

    toast.promise(promise, {
      loading: 'Actualizando progreso...',
      success: 'Progreso de la meta actualizado',
      error: (err) => err.message || 'No se pudo actualizar el progreso'
    });
  };
  // --- Fin función actualizar progreso ---

  const isLoading = isLoadingGoals;
  const isMutating = addMutation.isPending || updateMutation.isPending; // Incluir update para el progreso

  // Cálculo de estadísticas generales
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.current, 0);
  const overallProgress = Math.round((totalCurrentAmount / totalTargetAmount) * 100);
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 bg-gray-900 min-h-screen text-white"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Metas Financieras</h1>
        <Button onClick={handleAddClick} disabled={isMutating}> {/* Deshabilitar si se está guardando */}
          {showForm ? 'Cancelar' : 'Agregar Meta'}
        </Button>
      </div>

      {/* Área para el formulario */}
      {showForm && (
        <Card className="mb-6 bg-gray-800/60 border border-gray-700">
          <h2 className="text-xl font-medium mb-4">
            {isEditing ? 'Editar Meta' : 'Nueva Meta Financiera'}
          </h2>
          {/* Renderizar GoalForm */}
          <GoalForm 
            onSubmit={handleSaveGoal}
            isLoading={isMutating}
            isEditing={isEditing}
            defaultValues={selectedGoal}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {/* Área para la lista de metas */}
      <Card title="Mis Metas" className="bg-gray-800/60 border border-gray-700">
        {isLoading ? (
          <p className="text-center py-10 text-gray-400">Cargando metas...</p>
        ) : goals.length === 0 ? (
          <p className="text-center py-10 text-gray-400">Aún no has definido ninguna meta financiera.</p>
        ) : (
          // Renderizar GoalsList
          <GoalsList 
            goals={goals} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick}
            onUpdateProgress={handleUpdateProgress} // Pasar la nueva función
          />
        )}
      </Card>

    </motion.div>
  );
} 