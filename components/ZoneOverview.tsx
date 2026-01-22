
import React from 'react';
import { motion } from 'framer-motion';
import { Ward, DashboardTheme } from '../types';
// Corrected import path to data/wards
import { DELHI_WARDS } from '../data/wards';
import { ArrowLeft } from 'lucide-react';

interface ZoneOverviewProps {
  theme: DashboardTheme;
  zoneName: string;
  onSelectWard: (w: Ward) => void;
}

const ZoneOverview: React.FC<ZoneOverviewProps> = ({ theme, zoneName, onSelectWard }) => {
  const isDark = theme === 'dark';
  const zoneWards = DELHI_WARDS.filter(w => w.zone === zoneName);
  const averageAQI = Math.round(zoneWards.reduce((a, b) => a + b.aqi, 0) / (zoneWards.length || 1));
  const hotspots = [...zoneWards].sort((a, b) => b.aqi - a.aqi).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="mb-20">
        <h2 className="text-5xl font-black tracking-tighter mb-4">{zoneName} — Aggregated Stats</h2>
        <p className="opacity-30 font-medium">Sector-level environmental surveillance summary.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="glass-card p-12 rounded-[48px] flex flex-col justify-center text-center">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">Zone Average Index</span>
          <div className="text-[100px] font-black tracking-tighter leading-none text-cutout mb-6">{averageAQI}</div>
          <div className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] border mx-auto ${averageAQI > 200 ? 'border-rose-500 text-rose-500' : 'border-emerald-500 text-emerald-500'}`}>
            {averageAQI > 200 ? 'Unhealthy' : 'Moderate'}
          </div>
        </div>

        <div className="lg:col-span-2 glass-card p-12 rounded-[48px]">
          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-10">Active Response Nodes (Hotspots)</h4>
          <div className="space-y-6">
            {hotspots.map((w, i) => (
              <div key={i} onClick={() => onSelectWard(w)} className={`flex items-center justify-between p-6 rounded-3xl border border-current/5 cursor-pointer transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                <span className="text-xl font-bold">{w.name}</span>
                <span className={`text-2xl font-black ${w.aqi > 300 ? 'text-rose-500' : ''}`}>{w.aqi}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-10">
        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-10">All Sector Nodes in {zoneName}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zoneWards.map((w, i) => (
            <div key={i} onClick={() => onSelectWard(w)} className={`glass-card p-8 rounded-[32px] cursor-pointer transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-lg font-bold">{w.name}</span>
                <div className={`w-2 h-2 rounded-full ${w.aqi > 200 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              </div>
              <div className="text-3xl font-black tracking-tighter opacity-60">{w.aqi}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZoneOverview;
