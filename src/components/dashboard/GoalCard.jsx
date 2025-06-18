import React from 'react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useSettingsStore } from '@/lib/store/settings-store';
import Button from '../ui/Button';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function GoalCard({ goal, onEdit, onDelete, onUpdateProgress }) {
  const { currency, locale } = useSettingsStore();
  
  if (!goal) return null;

  const { nombre, monto_objetivo, monto_actual, fecha_objetivo, estado } = goal;
  
  // Calcular porcentaje de progreso
  const progressPercentage = Math.min(100, Math.round((monto_actual / monto_objetivo) * 100)) || 0;
  
  // Obtener color según el estado
  const getStatusColor = () => {
    switch (estado) {
      case 'completada':
        return 'border-green-500';
      case 'abandonada':
        return 'border-gray-500';
      default:
        return 'border-blue-500';
    }
  };
  
  // Obtener color de barra de progreso
  const getProgressColor = () => {
    if (estado === 'completada') return 'bg-green-500';
    if (progressPercentage >= 70) return 'bg-blue-500';
    return 'bg-purple-500';
  };

  // Función para manejar la adición de progreso
  const handleAddProgress = () => {
    const amountToAdd = prompt(`¿Cuánto quieres añadir al progreso de "${nombre}"?`);
    if (amountToAdd !== null) {
      const newAmount = parseFloat(amountToAdd);
      if (!isNaN(newAmount) && newAmount > 0) {
        const updatedCurrentAmount = monto_actual + newAmount;
        // Llamar a la función de actualización pasada desde la página
        onUpdateProgress(goal.id, updatedCurrentAmount);
      }
    }
  };

  return (
    <div 
      className={`bg-gray-800 rounded-xl overflow-hidden border ${getStatusColor()} shadow-lg transition-all hover:shadow-xl`}
    >
      <div className="p-5">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className={`font-medium text-white text-lg truncate ${estado === 'completada' ? 'line-through' : ''}`} title={nombre}>
                {nombre}
              </h3>
              {fecha_objetivo && (
                <span className="text-xs text-gray-400">
                  Meta para: {formatDate(fecha_objetivo, undefined, locale)}
                </span>
              )}
            </div>
            
            {/* Botones de Acción */}
            <div className="flex space-x-1 flex-shrink-0">
              {estado === 'activa' && (
                <>
                  <Button 
                    variant="outline"
                    size="icon-sm" 
                    onClick={handleAddProgress}
                    title="Añadir progreso"
                  >
                    <FaPlus size={12} />
                  </Button>
                  <Button 
                    variant="outline"
                    size="icon-sm" 
                    onClick={() => onEdit(goal)}
                    title="Editar meta"
                  >
                    <FaEdit size={12} />
                  </Button>
                </>
              )}
              <Button 
                variant="destructive"
                size="icon-sm" 
                onClick={() => onDelete(goal.id)}
                title="Eliminar meta"
              >
                <FaTrash size={12} />
              </Button>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className={`font-medium ${estado === 'completada' ? 'text-green-400' : 'text-white'}`}>
                {formatCurrency(monto_actual, currency, locale)}
              </span>
              <span className="text-gray-400">
                / {formatCurrency(monto_objetivo, currency, locale)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full ${getProgressColor()} transition-all duration-500 ease-out`}
                style={{ width: `${progressPercentage}%` }} 
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Progreso</span>
              <span className={`text-xs font-medium ${estado === 'completada' ? 'text-green-400' : 'text-blue-400'}`}>
                {progressPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 