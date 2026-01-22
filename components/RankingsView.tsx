
import React from 'react';
import { motion } from 'framer-motion';
import { Ward, DashboardTheme } from '../types';

interface RankingsViewProps {
  theme: DashboardTheme;
  onSelect: (w: Ward) => void;
  wards: Ward[];
}

const RankingsView: React.FC<RankingsViewProps> = ({ theme, onSelect, wards }) => {
  const sortedWards = React.useMemo(() => [...wards].sort((a, b) => b.aqi - a.aqi), [wards]);
  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-20 text-center">
        <h2 className="text-5xl font-black tracking-tighter mb-4 uppercase">Full NCT Registry</h2>
        <p className="opacity-30 font-medium tracking-wide">Comprehensive toxicity rankings across all 274 municipal sectors.</p>
      </header>

      <div className="flex flex-col gap-4 pb-20">
        {sortedWards.map((ward, i) => (
          <motion.div
            key={String(ward.id)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.01, 1) }}
            onClick={() => onSelect(ward)}
            className={`glass p-8 rounded-[32px] flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-all ${isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-black/[0.03]'}`}
          >
            <div className="flex items-center gap-10">
              <span className="text-2xl font-black opacity-15 tabular-nums">#{String(i + 1)}</span>
              <div>
                <h3 className="text-xl font-bold mb-1 truncate max-w-[200px]">{String(ward.name)}</h3>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{String(ward.region)} Delhi • {String(ward.zone)}</span>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-right">
                <div className={`text-4xl font-black tracking-tighter tabular-nums ${ward.aqi > 300 ? 'text-rose-500' : 'text-current opacity-60'}`}>{Number(ward.aqi)}</div>
                <div className="text-[8px] font-black uppercase tracking-widest opacity-20">Current AQI</div>
              </div>
              <div className={`hidden md:block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current/10 ${ward.aqi > 200 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {String(ward.status)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RankingsView;
