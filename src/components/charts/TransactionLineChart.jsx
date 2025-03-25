import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  Dot
} from 'recharts';
import { formatCurrency, formatDate } from '../../lib/utils/format';

// Renderizar un punto personalizado para el punto activo
const CustomActiveDot = (props) => {
  const { cx, cy, stroke, fill } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} stroke={stroke} strokeWidth={2} fill={fill} />
      <circle cx={cx} cy={cy} r={10} stroke={stroke} strokeWidth={2} fill="none" />
    </g>
  );
};

export default function TransactionLineChart({ data = [] }) {
  const [opacity, setOpacity] = useState({
    income: 1,
    expense: 1,
    balance: 1
  });

  // Si no hay datos, mostrar mensaje
  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No hay datos para mostrar
      </div>
    );
  }

  // Obtener valor máximo y mínimo para las referencias
  const maxValue = Math.max(...data.map(item => Math.max(item.income, item.expense, item.balance)));
  const minValue = Math.min(...data.map(item => Math.min(item.income, item.expense, item.balance)));

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-gray-800 shadow-lg rounded-md text-white">
          <p className="text-sm font-medium mb-1 text-[#00E676]">{formatDate(label, 'MMMM d, yyyy')}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm">
                <span className="font-medium">{entry.name}: </span>
                <span>{formatCurrency(Math.abs(entry.value))}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Manejar click en leyenda para mostrar/ocultar líneas
  const handleLegendClick = (dataKey) => {
    setOpacity({
      ...opacity,
      [dataKey]: opacity[dataKey] === 0 ? 1 : 0
    });
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => formatDate(date, 'MMM d')}
            stroke="#aaa"
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value, 'MXN', 0)}
            stroke="#aaa"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            onClick={(e) => handleLegendClick(e.dataKey)}
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={(value, entry, index) => <span className="text-white">{value}</span>}
          />
          
          {/* Línea de referencia en 0 */}
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />
          
          <Line
            type="monotone"
            dataKey="income"
            name="Ingresos"
            stroke="#00E676"
            strokeWidth={2}
            activeDot={<CustomActiveDot />}
            strokeOpacity={opacity.income}
            dot={{ stroke: '#00E676', strokeWidth: 2, fill: '#00E676', r: 4, strokeOpacity: opacity.income }}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
          <Line 
            type="monotone" 
            dataKey="expense" 
            name="Gastos" 
            stroke="#FF5252" 
            strokeWidth={2}
            activeDot={<CustomActiveDot />}
            strokeOpacity={opacity.expense}
            dot={{ stroke: '#FF5252', strokeWidth: 2, fill: '#FF5252', r: 4, strokeOpacity: opacity.expense }}
            animationDuration={1500}
            animationEasing="ease-in-out"
            animationBegin={300}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="#40C4FF"
            strokeWidth={2}
            strokeDasharray="5 5"
            strokeOpacity={opacity.balance}
            dot={{ stroke: '#40C4FF', strokeWidth: 2, fill: '#40C4FF', r: 4, strokeOpacity: opacity.balance }}
            activeDot={<CustomActiveDot />}
            animationDuration={1500}
            animationEasing="ease-in-out"
            animationBegin={600}
          />
          
          <Brush 
            dataKey="date" 
            height={20} 
            stroke="rgba(255,255,255,0.3)"
            fill="rgba(0,0,0,0.1)"
            tickFormatter={(date) => formatDate(date, 'MMM')}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 