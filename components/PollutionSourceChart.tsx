import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { DashboardTheme } from '../types';

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface PollutionSourceChartProps {
  data: DataPoint[];
  theme: DashboardTheme;
}

const PollutionSourceChart: React.FC<PollutionSourceChartProps> = ({ data, theme }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          onMouseMove={(state) => {
            if (state.activeTooltipIndex !== undefined) {
              setHoveredIndex(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className={`glass-card px-4 py-2 rounded-2xl border ${isDark ? 'border-white/20' : 'border-black/5'} shadow-2xl backdrop-blur-3xl`}>
                    <p className={`font-black text-xl tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{payload[0].value}%</p>
                    <p className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>{payload[0].name}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="value" 
            radius={[50, 50, 50, 50]}
            barSize={32}
            animationDuration={1200}
            animationEasing="cubic-bezier(0.23, 1, 0.32, 1)"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                style={{
                  opacity: hoveredIndex === null || hoveredIndex === index ? 0.8 : 0.2,
                  transition: 'opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1), transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  filter: hoveredIndex === index ? 'brightness(1.2) saturate(1.2)' : 'none',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PollutionSourceChart;