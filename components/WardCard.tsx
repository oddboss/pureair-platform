
import React from 'react';
import { motion } from 'framer-motion';
import { Ward, AQILevel, DashboardTheme } from '../types';
import { Activity, ArrowUpRight, ShieldCheck } from 'lucide-react';
import TrendSparkline from './TrendSparkline';

interface WardCardProps {
  ward: Ward;
  onClick: (ward: Ward) => void;
  index: number;
  theme: DashboardTheme;
}

const appleBezier = [0.25, 1, 0.5, 1];

const WardCard: React.FC<WardCardProps> = ({ ward, onClick, index, theme }) => {
  const getStatusColor = (status: AQILevel) => {
    switch (status) {
      case AQILevel.HAZARDOUS: return '#af0000';
      case AQILevel.SEVERE: return '#ff3b30';
      case AQILevel.POOR: return '#ff9500';
      case AQILevel.MODERATE: return '#ffcc00';
      case AQILevel.GOOD: return '#34c759';
      default: return '#8e8e93';
    }
  };

  const statusColor = getStatusColor(ward.status);
  const isDark = theme === 'dark';

  return (
    <motion.div
      layoutId={`ward-${ward.id}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.05, 
        ease: appleBezier 
      }}
      whileHover={{ 
        y: -16, 
        scale: 1.015,
        transition: { duration: 0.5, ease: appleBezier } 
      }}
      onClick={() => onClick(ward)}
      className={`relative p-12 rounded-[64px] cursor-pointer flex flex-col justify-between h-[560px] overflow-hidden transition-all duration-500
        ${isDark 
          ? 'bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]' 
          : 'bg-black/[0.01] border border-black/[0.08] hover:bg-black/[0.02] hover:border-black/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]'
        } backdrop-blur-[60px] group`}
    >
      {/* Dynamic Background Glow */}
      <div 
        className="absolute -top-20 -right-20 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000"
        style={{ background: statusColor }}
      />

      <div className="absolute top-12 right-12 opacity-0 group-hover:opacity-60 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
        <ArrowUpRight size={24} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
          <ShieldCheck size={14} className="text-indigo-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">Sector Registry Node ${ward.id}</span>
          <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
        </div>
        
        <motion.h3 
          layoutId={`ward-title-${ward.id}`}
          className={`text-4xl font-black tracking-tighter mb-4 leading-none transition-colors ${isDark ? 'text-white' : 'text-black'}`}
        >
          {ward.name}
        </motion.h3>
        
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: statusColor }}>
            {ward.status} PHASE
          </span>
        </div>
      </div>

      <div className="relative z-10 my-8 opacity-40 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-[1.05]">
        <TrendSparkline color={statusColor} />
      </div>

      <div className={`relative z-10 flex items-end justify-between pt-10 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <div className="flex flex-col">
          <motion.div 
            layoutId={`ward-aqi-${ward.id}`}
            className="text-[90px] font-black tracking-tighter leading-none text-cutout tabular-nums"
          >
            {ward.aqi}
          </motion.div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20 mt-4 group-hover:opacity-50 transition-opacity">Response Index</span>
        </div>
        
        <div className="text-right flex flex-col items-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
          <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
            <Activity size={10} className="animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">Live Telemetry</span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{ward.primarySource}</p>
        </div>
      </div>

      {/* Subtle Inner Glow Layer */}
      <div className={`absolute inset-0 rounded-[64px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 border border-white/5 ring-1 ring-white/10 inset-shadow-sm`} />
    </motion.div>
  );
};

export default WardCard;
