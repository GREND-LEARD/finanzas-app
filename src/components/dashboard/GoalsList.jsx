import React from 'react';
import GoalCard from './GoalCard';

export default function GoalsList({ 
  goals = [], 
  onEdit, 
  onDelete, 
  onUpdateProgress // Recibir la función para actualizar progreso
}) {
  if (goals.length === 0) {
    return <p className="text-center py-10 text-gray-400">No hay metas financieras para mostrar.</p>; 
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {goals.map((goal) => (
        <GoalCard 
          key={goal.id} 
          goal={goal} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onUpdateProgress={onUpdateProgress} // Pasar la función a la tarjeta
        />
      ))}
    </div>
  );
} 