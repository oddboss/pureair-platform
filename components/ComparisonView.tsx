import React from 'react';
import { motion } from 'framer-motion';
import { Ward, DashboardTheme } from '../types';
import { ArrowLeftRight, Wind, Droplets, Target, Shield } from 'lucide-react';

interface ComparisonViewProps {
  wardA: Ward;
  wardB: Ward;
  theme: DashboardTheme;
  onClose: () => void;
}

const getBetter = (valA: number, valB: number, lowerIsBetter = true) => {
  if (valA === valB) return null;
  return lowerIsBetter ? (valA < valB ? 'A' : 'B') : (valA > valB ? 'A' : 'B');
};

const ComparisonRow = ({ label, icon: Icon, valueA, valueB, suffix = "", lowerIsBetter = true, isDark }: any) => {
  const winner = getBetter(valueA, valueB, lowerIsBetter);
  const accentColor = isDark ? 'text-white' : 'text-black';
  const mutedColor = isDark ? 'text-white/30' : 'text-black/30';
  
  return (
    <div className={`grid grid-cols-12 gap-4 py-6 border-b items-center ${isDark ? 'border-white/5' : 'border-black/5'}`}>
      <div className="col-span-4 text-right">
        <span className={`text-2xl font-black tracking-tight ${winner === 'A' ? accentColor : mutedColor}`}>
          {String(valueA)}{suffix}
        </span>
      </div>
      <div className="col-span-4 flex flex-col items-center gap-1">
        <Icon size={16} className="opacity-20" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-center">{String(label)}</span>
      </div>
      <div className="col-span-4 text-left">
        <span className={`text-2xl font-black tracking-tight ${winner === 'B' ? accentColor : mutedColor}`}>
          {String(valueB)}{suffix}
        </span>
      </div>
    </div>
  );
};

const ComparisonView: React.FC<ComparisonViewProps> = ({ wardA, wardB, theme, onClose }) => {
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed inset-0 z-[60] flex items-center justify-center p-6 backdrop-blur-xl ${isDark ? 'bg-black/90' : 'bg-[#f5f5f7]/90'}`}
    >
      <div className="w-full max-w-5xl glass-card rounded-[48px] overflow-hidden flex flex-col">
        <div className={`p-8 border-b flex justify-between items-center ${isDark ? 'border-white/10' : 'border-black/5'}`}>
          <div className="flex items-center gap-4">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                <ArrowLeftRight size={20} className="opacity-60" />
             </div>
             <h2 className="text-xl font-black uppercase tracking-widest">Comparative Intelligence</h2>
          </div>
          <button onClick={onClose} className={`px-6 py-2 rounded-full border text-xs font-bold transition-colors ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'}`}>
            Exit Analysis
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
          <div className="grid grid-cols-12 gap-4 mb-12">
            <div className="col-span-4 text-right">
              <h3 className="text-4xl font-black tracking-tighter mb-2">{String(wardA.name)}</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Reference Sector</span>
            </div>
            <div className="col-span-4" />
            <div className="col-span-4 text-left">
              <h3 className="text-4xl font-black tracking-tighter mb-2">{String(wardB.name)}</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Target Sector</span>
            </div>
          </div>

          <div className="space-y-2">
            <ComparisonRow isDark={isDark} label="Overall AQI" icon={Shield} valueA={wardA.aqi} valueB={wardB.aqi} />
            <ComparisonRow isDark={isDark} label="PM 2.5 Density" icon={Target} valueA={wardA.pollutants.pm25} valueB={wardB.pollutants.pm25} suffix=" µg/m³" />
            <ComparisonRow isDark={isDark} label="PM 10 Density" icon={Target} valueA={wardA.pollutants.pm10} valueB={wardB.pollutants.pm10} suffix=" µg/m³" />
            <ComparisonRow isDark={isDark} label="Wind Velocity" icon={Wind} valueA={wardA.windSpeed} valueB={wardB.windSpeed} suffix=" km/h" lowerIsBetter={false} />
            <ComparisonRow isDark={isDark} label="Humidity Level" icon={Droplets} valueA={wardA.humidity} valueB={wardB.humidity} suffix="%" lowerIsBetter={false} />
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8">
            <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">Primary Vector: {String(wardA.name)}</h4>
               <p className="text-lg font-medium opacity-80">{String(wardA.primarySource)}</p>
            </div>
            <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">Primary Vector: {String(wardB.name)}</h4>
               <p className="text-lg font-medium opacity-80">{String(wardB.primarySource)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonView;