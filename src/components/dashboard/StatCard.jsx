import React from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import { useSettingsStore } from '@/lib/store/settings-store';
import Card from '../ui/Card';

export default function StatCard({
  title,
  value,
  change,
  icon,
  color = 'blue',
  className = ''
}) {
  const { currency, locale } = useSettingsStore();

  // Colores para diferentes estados
  const colors = {
    blue: 'bg-blue-500/20 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    green: 'bg-green-500/20 text-green-600 dark:bg-green-500/10 dark:text-green-400',
    red: 'bg-red-500/20 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    purple: 'bg-purple-500/20 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
    yellow: 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400',
  };

  // Determinar si el cambio es positivo o negativo
  const isPositive = change > 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeIcon = isPositive ? '↑' : '↓';

  // Determina si el valor es monetario
  const isMonetary = typeof value === 'number' && (
    title.toLowerCase().includes('ingreso') || 
    title.toLowerCase().includes('gasto') || 
    title.toLowerCase().includes('balance') ||
    title.toLowerCase().includes('ahorro')
  );

  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`p-2 rounded-full ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <h4 className="text-2xl font-bold">
          {isMonetary ? formatCurrency(value, currency, locale) : value}
        </h4>
        {change !== undefined && (
          <p className={`text-xs ${changeColor} flex items-center`}>
            <span>{changeIcon} {Math.abs(change).toFixed(1)}%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">desde el mes pasado</span>
          </p>
        )}
      </div>
    </Card>
  );
} 