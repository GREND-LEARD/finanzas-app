import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency, formatDate } from '../../lib/utils/format';

export default function FinancialAreaChart({ data = [], areaType = 'monotone' }) {
  // Si no hay datos, mostrar mensaje
  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No hay datos para mostrar
      </div>
    );
  }

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-gray-800 shadow-lg rounded-md text-white">
          <p className="text-sm font-bold text-[#00E676] mb-2">
            {formatDate(label, 'MMMM d, yyyy')}
          </p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={`item-${index}`} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-sm flex justify-between w-full">
                  <span className="font-medium">{entry.name}: </span>
                  <span className="ml-4 font-bold">{formatCurrency(Math.abs(entry.value))}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E676" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FF5252" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#40C4FF" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#40C4FF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
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
            formatter={(value, entry, index) => <span className="text-white">{value}</span>}
          />
          
          <Area 
            type={areaType}
            dataKey="income"
            name="Ingresos"
            stroke="#00E676"
            fillOpacity={1}
            fill="url(#colorIncome)"
            animationDuration={2000}
            animationEasing="ease-in-out"
          />
          
          <Area 
            type={areaType}
            dataKey="expense"
            name="Gastos"
            stroke="#FF5252"
            fillOpacity={1}
            fill="url(#colorExpense)"
            animationDuration={2000}
            animationEasing="ease-in-out"
            animationBegin={300}
          />
          
          <Area 
            type={areaType}
            dataKey="balance"
            name="Balance"
            stroke="#40C4FF"
            fillOpacity={1}
            fill="url(#colorBalance)"
            animationDuration={2000}
            animationEasing="ease-in-out"
            animationBegin={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 