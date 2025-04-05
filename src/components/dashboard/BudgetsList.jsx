import React from 'react';
import BudgetCard from './BudgetCard';

export default function BudgetsList({ budgets = [], onEdit, onDelete }) {
  if (budgets.length === 0) {
    // Este caso ya se maneja en la página principal, pero por si acaso
    return <p className="text-center py-10 text-gray-400">No hay presupuestos para mostrar.</p>; 
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {budgets.map((budget) => (
        <BudgetCard 
          key={budget.id} 
          budget={budget} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
} 