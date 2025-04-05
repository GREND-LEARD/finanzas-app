import React from 'react';
import { FaEdit, FaTrash, FaExclamationTriangle, FaCheckCircle, FaRegClock } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../lib/utils/format';
import Button from '../ui/Button';

// Función para determinar el estado del presupuesto
const getBudgetStatus = (spent, limit) => {
  if (spent > limit) return 'exceeded';
  if (spent / limit >= 0.85) return 'warning'; // Advertencia si se ha gastado el 85% o más
  return 'onTrack';
};

export default function BudgetCard({ budget, onEdit, onDelete }) {
  if (!budget) return null;

  const spent = budget.spent_amount || 0;
  const limit = budget.amount;
  const progress = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const status = getBudgetStatus(spent, limit);
  const remaining = limit - spent;
  const categoryName = budget.categories?.name || 'Categoría Desconocida';
  const categoryColor = budget.categories?.color || '#8884d8'; // Color por defecto

  const statusStyles = {
    exceeded: {
      borderColor: 'border-[#FF5252]',
      textColor: 'text-[#FF5252]',
      bgColor: 'bg-[#FF5252]',
      icon: <FaExclamationTriangle className="w-5 h-5 text-gray-900" />,
    },
    warning: {
      borderColor: 'border-[#FFD54F]',
      textColor: 'text-[#FFD54F]',
      bgColor: 'bg-[#FFD54F]',
      icon: <FaRegClock className="w-5 h-5 text-gray-900" />,
    },
    onTrack: {
      borderColor: 'border-gray-700',
      textColor: 'text-[#00E676]',
      bgColor: 'bg-[#00E676]',
      icon: <FaCheckCircle className="w-5 h-5 text-gray-900" />,
    },
  };

  const currentStatusStyle = statusStyles[status];

  return (
    <div 
      className={`bg-gray-800 rounded-xl overflow-hidden border ${currentStatusStyle.borderColor} shadow-lg transition-all hover:shadow-xl`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          {/* Icono y Nombre */}
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: categoryColor }}
            >
              {currentStatusStyle.icon}
            </div>
            <div>
              <h3 className="font-medium text-white text-lg truncate" title={budget.name}>
                {budget.name}
              </h3>
              <span className="text-sm text-gray-400">
                {categoryName}
              </span>
            </div>
          </div>
          {/* Botones de Acción */}
          <div className="flex space-x-1 flex-shrink-0">
            <Button 
              variant="dark"
              size="sm"
              onClick={() => onEdit(budget)}
              className="p-2 aspect-square"
              aria-label="Editar Presupuesto"
            >
              <FaEdit />
            </Button>
            <Button 
              variant="danger"
              size="sm"
              onClick={() => onDelete(budget.id)}
              className="p-2 aspect-square"
              aria-label="Eliminar Presupuesto"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
        
        {/* Información Financiera */}
        <div className="mb-4 space-y-1">
           <p className="text-sm text-gray-400">
             Periodo: {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
           </p>
           <div className="flex justify-between items-baseline">
             <span className={`text-xl font-semibold ${currentStatusStyle.textColor}`}>{formatCurrency(spent)}</span>
             <span className="text-sm text-gray-400">/ {formatCurrency(limit)}</span>
           </div>
           <p className={`text-xs ${remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
             {remaining >= 0 ? `${formatCurrency(remaining)} restantes` : `${formatCurrency(Math.abs(remaining))} excedidos`}
           </p>
        </div>

        {/* Barra de Progreso */}
        <div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full ${currentStatusStyle.bgColor} transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(progress, 100)}%` }} 
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">Progreso</span>
            <span className={`text-xs font-medium ${currentStatusStyle.textColor}`}>{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
} 