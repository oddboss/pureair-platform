
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, ShieldAlert, BarChart3, Loader2 } from 'lucide-react';
import { getAqiForecast } from '../services/geminiService';
import { getHistoricalContext, calculateTrendSlope } from '../services/aqiService';
import { AtmosphericPrediction, DashboardTheme } from '../types';

interface ForecastViewProps {
  currentAqi: number;
  theme: DashboardTheme;
}

const ForecastView: React.FC<ForecastViewProps> = ({ currentAqi, theme }) => {
  const [predictions, setPredictions] = useState<AtmosphericPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      // 1. Generate historical context for the city
      const history = getHistoricalContext(currentAqi);
      // 2. Compute the trend slope (dy/dx)
      const slope = calculateTrendSlope(history);
      // 3. Request refined forecast from intelligence service
      const data = await getAqiForecast(currentAqi, slope);
      setPredictions(data);
      setLoading(false);
    };
    fetchForecast();
  }, [currentAqi]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
        <span className="text-[10px] font-black uppercase tracking-[0.8em] opacity-30">Synthesizing Atmospheric Models</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-40">
      <header className="text-center md:text-left flex flex-col md:flex-row items-end justify-between gap-10">
        <div className="max-w-xl">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-8">Intelligence Layer 05</h4>
           <h2 className="text-6xl font-black tracking-tighter mb-4 leading-none uppercase">Predictive Exposure Node</h2>
           <p className="opacity-40 text-lg font-medium leading-relaxed">AI-driven temporal projections for the NCT region based on atmospheric chemistry and diurnal patterns.</p>
        </div>
        <div className="glass px-10 py-6 rounded-[32px] border-white/5 flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-2">Confidence Matrix</span>
            <div className="text-4xl font-black text-indigo-400">92%</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {predictions.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass p-12 rounded-[56px] border border-white/5 flex flex-col relative overflow-hidden group hover:bg-white/[0.03] transition-all`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Clock size={100} /></div>
            
            <div className="flex items-center gap-4 mb-10">
               <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <Zap size={20} className="text-indigo-400" />
               </div>
               <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">+{p.hours}H PROJECTION</span>
            </div>

            <div className="flex flex-col mb-12">
               <span className="text-[120px] font-black tracking-tighter leading-none text-cutout tabular-nums">{p.aqi}</span>
               <div className="flex items-center gap-3 mt-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${p.riskLevel === 'Extreme' || p.riskLevel === 'High' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${p.riskLevel === 'Extreme' || p.riskLevel === 'High' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {p.riskLevel} Risk
                  </span>
               </div>
            </div>

            <div className="space-y-6 flex-1">
               <div className="pb-6 border-b border-white/5">
                  <span className="text-[9px] font-black uppercase opacity-20 block mb-2 tracking-widest">Primary Vector</span>
                  <div className="text-xl font-bold">{p.primaryPollutant}</div>
               </div>
               <div className="pb-6 border-b border-white/5">
                  <span className="text-[9px] font-black uppercase opacity-20 block mb-2 tracking-widest">Intelligence Summary</span>
                  <p className="text-sm font-medium opacity-50 leading-relaxed">{p.explanation}</p>
               </div>
            </div>

            <div className="mt-10 flex items-center justify-between opacity-30">
               <div className="flex items-center gap-2">
                  <BarChart3 size={12} />
                  <span className="text-[9px] font-bold uppercase">Confidence: {p.confidence}%</span>
               </div>
               <ShieldAlert size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`p-14 rounded-[64px] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'} text-center`}>
          <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">System Notice</h3>
          <p className="opacity-40 text-sm max-w-2xl mx-auto font-medium">Predictions are generated by the Gemini AtmosModel 3.0. For operational decisions, always refer to the live regulatory telemetry provided by CPCB/DPCC.</p>
      </div>
    </div>
  );
};

export default ForecastView;
