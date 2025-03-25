import React from 'react';
import { formatCurrency, formatDate } from '../../lib/utils/format';
import Button from '../ui/Button';

export default function TransactionsTable({ 
  transactions = [], 
  onEdit, 
  onDelete, 
  isLoading = false 
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No hay transacciones para mostrar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Monto
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-600">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">
                {formatDate(transaction.date)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-200">
                {transaction.description}
              </td>
              <td className="px-4 py-3 text-sm text-gray-200">
                {transaction.category}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right ${
                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 