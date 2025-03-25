import React from 'react';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

export default function StatCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  data, 
  chartType = 'line', 
  accentColor = '#00E676',
  bgColor = 'bg-gray-800',
  borderColor = 'border-gray-700'
}) {
  return (
    <div className={`rounded-xl shadow-lg ${bgColor} border ${borderColor} p-5 transition-all duration-300 hover:shadow-xl`}>
      <div className="flex flex-col h-full">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
        
        <div className="flex-grow h-20 my-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }} 
                  labelStyle={{ display: 'none' }}
                  formatter={(value) => [`${value}`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={accentColor} 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 4, stroke: accentColor, strokeWidth: 1 }} 
                />
              </LineChart>
            ) : (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accentColor} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={accentColor} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }} 
                  labelStyle={{ display: 'none' }}
                  formatter={(value) => [`${value}`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={accentColor} 
                  fill={`url(#gradient-${title})`} 
                  strokeWidth={2}
                  activeDot={{ r: 4, stroke: accentColor, strokeWidth: 1 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
            {isPositive ? (
              <HiArrowUp className="mr-1" />
            ) : (
              <HiArrowDown className="mr-1" />
            )}
            {change}%
          </div>
        </div>
      </div>
    </div>
  );
} 