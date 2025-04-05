import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart, // Opcional: para barras
  Bar,      // Opcional: para barras
} from 'recharts';
import { formatCurrency } from '../../lib/utils/format'; // Asumiendo que tienes esta utilidad

// Formatear etiqueta del eje Y a moneda
const yAxisTickFormatter = (value) => formatCurrency(value);

// Formatear contenido del Tooltip
const tooltipFormatter = (value, name) => {
  const formattedValue = formatCurrency(value);
  const label = name === 'income' ? 'Ingresos' : name === 'expense' ? 'Gastos' : name;
  return [formattedValue, label];
};

export default function IncomeExpenseChart({ data, chartType = 'line' }) { // Añadir prop chartType
  if (!data || data.length === 0) {
    return <p className="text-center py-10 text-gray-500">No hay datos para mostrar en el gráfico.</p>;
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#ccc" fontSize={12} />
            <YAxis stroke="#ccc" fontSize={12} tickFormatter={yAxisTickFormatter} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
              itemStyle={{ color: '#fff' }}
              formatter={tooltipFormatter}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }}/>
            <Bar dataKey="income" name="Ingresos" fill="#00E676" />
            <Bar dataKey="expense" name="Gastos" fill="#FF5252" />
          </BarChart>
        );
      case 'line':
      default:
        return (
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#ccc" fontSize={12} />
            <YAxis stroke="#ccc" fontSize={12} tickFormatter={yAxisTickFormatter} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
              itemStyle={{ color: '#fff' }}
              formatter={tooltipFormatter}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }}/>
            <Line type="monotone" dataKey="income" name="Ingresos" stroke="#00E676" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }}/>
            <Line type="monotone" dataKey="expense" name="Gastos" stroke="#FF5252" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }}/>
          </LineChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      {renderChart()}
    </ResponsiveContainer>
  );
} 