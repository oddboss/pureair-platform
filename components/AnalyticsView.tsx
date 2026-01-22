
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { DashboardTheme } from '../types';

const appleBezier = [0.25, 1, 0.5, 1];

const AnalyticsView: React.FC<{ theme: DashboardTheme }> = ({ theme }) => {
  const isDark = theme === 'dark';
  const hourlyData = Array.from({ length: 24 }).map((_, i) => ({ time: `${i}:00`, aqi: Math.floor(Math.random() * 200) + 100 }));
  const dailyData = Array.from({ length: 7 }).map((_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], aqi: Math.floor(Math.random() * 150) + 200 }));
  const pollutantData = [
    { name: 'PM2.5', value: 45, color: '#ff3b30' },
    { name: 'PM10', value: 30, color: '#ff9500' },
    { name: 'NO2', value: 15, color: '#ffcc00' },
    { name: 'Others', value: 10, color: '#34c759' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 mb-10">
        <h2 className="text-5xl font-black tracking-tighter mb-4">Atmospheric Analytics</h2>
        <p className="opacity-30 font-medium text-lg">Detailed temporal analysis for administrative intelligence.</p>
      </motion.div>

      <div className="glass-card p-10 rounded-[40px] flex flex-col gap-8 h-[400px]">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Hourly Exposure Trend (24h)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData}>
            <XAxis dataKey="time" hide />
            <Bar dataKey="aqi" radius={[4, 4, 0, 0]} fill={isDark ? "white" : "black"} opacity={0.15} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-10 rounded-[40px] flex flex-col gap-8 h-[400px]">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Daily Median Index (7 Days)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData}>
            <Line type="monotone" dataKey="aqi" stroke={isDark ? "white" : "black"} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-10 rounded-[40px] flex flex-col gap-8 h-[400px]">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Pollutant Contribution Profile</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pollutantData} layout="vertical" margin={{ left: 40 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: isDark ? 'white' : 'black', fontSize: 10, opacity: 0.4 }} />
            <Bar dataKey="value" radius={[0, 20, 20, 0]} barSize={20}>
              {pollutantData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-10 rounded-[40px] flex flex-col justify-center gap-4 h-[400px]">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Intelligence Summary</h4>
        <div className="space-y-6">
          <div className="flex justify-between border-b border-current/5 pb-4">
            <span className="opacity-40 text-sm font-bold uppercase tracking-widest">Peak AQI Timestamp</span>
            <span className="font-black">11:00 PM (482)</span>
          </div>
          <div className="flex justify-between border-b border-current/5 pb-4">
            <span className="opacity-40 text-sm font-bold uppercase tracking-widest">Baseline Variance</span>
            <span className="font-black text-rose-500">+12% vs Yesterday</span>
          </div>
          <div className="flex justify-between border-b border-current/5 pb-4">
            <span className="opacity-40 text-sm font-bold uppercase tracking-widest">Cleanest Interval</span>
            <span className="font-black">04:00 AM (112)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
