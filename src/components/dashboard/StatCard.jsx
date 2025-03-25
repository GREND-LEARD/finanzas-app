import React from 'react';
import Card from '../ui/Card';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  className = '',
  color = 'blue'
}) {
  // Colores para diferentes estados
  const colors = {
    blue: 'text-blue-400 bg-blue-400/10',
    green: 'text-green-400 bg-green-400/10',
    red: 'text-red-400 bg-red-400/10',
    yellow: 'text-yellow-400 bg-yellow-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
  };

  // Determinar si el cambio es positivo o negativo
  const isPositive = change > 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const changeIcon = isPositive ? '↑' : '↓';

  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <p className="text-2xl font-semibold mt-1 text-white">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${changeColor}`}>
                {changeIcon} {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs periodo anterior</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-full ${colors[color]}`}>
            {typeof Icon === 'function' ? <Icon /> : <Icon className="w-6 h-6" />}
          </div>
        )}
      </div>
    </Card>
  );
} 