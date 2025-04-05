import React from 'react';
import { FaEdit, FaTrash, FaCheck, FaBullseye, FaPlus } from 'react-icons/fa'; // Usar FaBullseye como icono por defecto
import { formatCurrency, formatDate } from '../../lib/utils/format';
import Button from '../ui/Button';

export default function GoalCard({ goal, onEdit, onDelete, onUpdateProgress }) {
  if (!goal) return null;

  const targetAmount = goal.target_amount || 0;
  const currentAmount = goal.current_amount || 0;
  const progress = targetAmount > 0 ? Math.round((currentAmount / targetAmount) * 100) : 0;
  const isCompleted = goal.status === 'completed'; // Usar el status de la DB

  // Podríamos añadir colores o iconos basados en el progreso o tipo de meta en el futuro
  const cardBorderColor = isCompleted ? 'border-green-500' : 'border-gray-700';
  const progressBarColor = isCompleted ? 'bg-green-500' : 'bg-blue-500'; // Usar azul para progreso

  // Función para manejar la adición de progreso (simplificado por ahora)
  // Podría abrir un modal o un input inline en el futuro
  const handleAddProgress = () => {
    const amountToAdd = prompt(`¿Cuánto quieres añadir al progreso de "${goal.name}"?`);
    if (amountToAdd !== null) {
      const newAmount = parseFloat(amountToAdd);
      if (!isNaN(newAmount) && newAmount > 0) {
        const updatedCurrentAmount = currentAmount + newAmount;
        // Llamar a la función de actualización pasada desde la página
        onUpdateProgress(goal.id, updatedCurrentAmount);
      } else if (newAmount <= 0) {
        alert('Por favor, introduce un monto positivo.');
      } else {
        alert('Monto inválido.');
      }
    }
  };

  return (
    <div 
      className={`bg-gray-800 rounded-xl overflow-hidden border ${cardBorderColor} shadow-lg transition-all hover:shadow-xl`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          {/* Icono (simple por ahora) y Nombre */}
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-blue-500/20 text-blue-400"
            >
               <FaBullseye className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-medium text-white text-lg truncate ${isCompleted ? 'line-through' : ''}`} title={goal.name}>
                {goal.name}
              </h3>
              {goal.target_date && (
                <span className="text-xs text-gray-400">
                  Objetivo: {formatDate(goal.target_date)}
                </span>
              )}
            </div>
          </div>
          {/* Botones de Acción */}
          <div className="flex space-x-1 flex-shrink-0">
             {!isCompleted && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleAddProgress} 
                  className="p-2 aspect-square border-blue-500 text-blue-500 hover:bg-blue-500/10"
                  aria-label="Añadir Progreso"
                  title="Añadir Progreso"
                >
                  <FaPlus size={10}/> {/* Icono más pequeño */}
                </Button>
             )}
             <Button 
              variant="dark"
              size="sm"
              onClick={() => onEdit(goal)}
              className="p-2 aspect-square"
              aria-label="Editar Meta"
              title="Editar Meta"
            >
              <FaEdit />
            </Button>
            <Button 
              variant="danger"
              size="sm"
              onClick={() => onDelete(goal.id)}
              className="p-2 aspect-square"
              aria-label="Eliminar Meta"
              title="Eliminar Meta"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
        
        {/* Información Financiera y Progreso*/}
        <div>
           <div className="flex justify-between mb-1 text-sm">
             <span className={`font-medium ${isCompleted ? 'text-green-400' : 'text-white'}`}>{formatCurrency(currentAmount)}</span>
             <span className="text-gray-400">/ {formatCurrency(targetAmount)}</span>
           </div>
           <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
             <div 
               className={`h-2.5 rounded-full ${progressBarColor} transition-all duration-500 ease-out`}
               style={{ width: `${Math.min(progress, 100)}%` }} 
             ></div>
           </div>
           <div className="flex justify-between mt-1">
             <span className="text-xs text-gray-400">Progreso</span>
             <span className={`text-xs font-medium ${isCompleted ? 'text-green-400' : 'text-blue-400'}`}>{progress}%</span>
           </div>
        </div>

      </div>
    </div>
  );
} 