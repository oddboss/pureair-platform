
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TrendSparklineProps {
  color: string;
}

const TrendSparkline: React.FC<TrendSparklineProps> = ({ color }) => {
  // Generate random trend data
  const data = Array.from({ length: 12 }).map((_, i) => ({
    value: Math.floor(Math.random() * 100) + 150
  }));

  return (
    <div className="w-full h-12 opacity-50 group-hover:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendSparkline;
