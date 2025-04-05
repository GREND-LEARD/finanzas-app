import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { formatCurrency } from '../../lib/utils/format'; // Asumiendo utilidad de formato

// Colores para las porciones del gráfico (puedes personalizarlos)
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF5252', '#4CAF50', '#FFC107', '#9C27B0', '#2196F3'];

// Formatear contenido del Tooltip
const tooltipFormatter = (value, name) => {
  return [`${formatCurrency(value)}`, name];
};

// Formatear etiqueta de leyenda (opcional)
const legendFormatter = (value, entry) => {
  const { color } = entry;
  return <span style={{ color }}>{value}</span>;
};

// Etiqueta personalizada para las porciones (opcional, puede ser compleja)
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  if (percent < 0.05) return null; // No mostrar etiquetas para porciones muy pequeñas
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ExpenseDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center py-10 text-gray-500">No hay datos de gastos para mostrar.</p>;
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
          // formatter={legendFormatter} // Puedes usar el formateador de leyenda si quieres
        />
        <Pie
          data={data}
          cx="40%" // Ajustar centro para dejar espacio a la leyenda
          cy="50%"
          labelLine={false}
          // label={renderCustomizedLabel} // Habilitar si quieres etiquetas en las porciones
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