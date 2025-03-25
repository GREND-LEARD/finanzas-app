import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { formatCurrency } from '../../lib/utils/format';

// Colores para las categorías - ajustado a la paleta de la app
const COLORS = ['#00E676', '#64FFDA', '#1DE9B6', '#00BFA5', '#4FC3F7', '#40C4FF', '#18FFFF', '#84FFFF'];

export default function ExpensePieChart({ data = [] }) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Si no hay datos, mostrar mensaje
  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No hay datos para mostrar
      </div>
    );
  }

  // Formatear tooltip para mostrar el valor y porcentaje
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, percent } = payload[0];
      return (
        <div className="bg-gray-900 p-3 border border-gray-800 shadow-lg rounded-md text-white">
          <p className="font-medium text-[#00E676]">{name}</p>
          <p className="text-sm">{formatCurrency(value)}</p>
          <p className="text-xs text-gray-400">{`${(percent * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Sector activo animado
  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-midAngle * Math.PI / 180);
    const cos = Math.cos(-midAngle * Math.PI / 180);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#FFF" fontSize={12}>
          {`${payload.name}: ${formatCurrency(value)}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={10}>
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Renderizar el gráfico circular
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            onMouseEnter={onPieEnter}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            formatter={(value, entry, index) => <span className="text-white">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 