import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { formatCurrency } from '../../lib/utils/format';

// Paleta de colores diferente para ingresos (puedes ajustar)
const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#82ca9d', '#8884d8', '#FF8042'];

// Formateador de Tooltip (igual que en gastos)
const tooltipFormatter = (value, name) => {
  return [`${formatCurrency(value)}`, name];
};

export default function IncomeSourceChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center py-10 text-gray-500">No hay datos de ingresos para mostrar.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip 
          contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
          itemStyle={{ color: '#fff' }}
          formatter={tooltipFormatter}
        />
        <Legend 
          layout="vertical" 
          verticalAlign="middle" 
          align="right" 
          iconType="circle"
          wrapperStyle={{ fontSize: '12px', lineHeight: '1.5' }}
        />
        <Pie
          data={data}
          cx="40%" // Ajustar centro
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
} 