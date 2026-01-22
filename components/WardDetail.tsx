
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wind, 
  Droplets, 
  BrainCircuit, 
  ShieldCheck,
  Zap,
  Activity,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Fingerprint,
  BarChart3,
  Target,
  LayoutGrid
} from 'lucide-react';
import { Ward, DashboardTheme, MitigationPlan, SourceAttribution } from '../types';
import { getMitigationPlan, getSimulationReport, getSourceAttribution } from '../services/geminiService';
import SourceAttributionCard from './SourceAttributionCard';

interface WardDetailProps {
  ward: Ward;
  theme: DashboardTheme;
  wardsInRegion: Ward[];
  onClose: () => void;
}

const appleEase = [0.25, 1, 0.5, 1];

const WardDetail: React.FC<WardDetailProps> = ({ ward, theme, wardsInRegion, onClose }) => {
  const [plan, setPlan] = useState<MitigationPlan | null>(null);
  const [simulation, setSimulation] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<SourceAttribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzingSource, setAnalyzingSource] = useState(false);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [mitPlan, sim] = await Promise.all([
        getMitigationPlan(ward),
        getSimulationReport(ward, 24)
      ]);
      setPlan(mitPlan);
      setSimulation(sim);
      setLoading(false);
    };
    fetchData();
  }, [ward]);

  const handleSourceAnalysis = async () => {
    setAnalyzingSource(true);
    try {
      const data = await getSourceAttribution(ward);
      setAttribution(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingSource(false);
    }
  };

  // Fix for line 69: Added useMemo from React to calculate regional rank
  const regionalRank = useMemo(() => {
    const sorted = [...wardsInRegion].sort((a, b) => b.aqi - a.aqi);
    return sorted.findIndex(w => w.id === ward.id) + 1;
  }, [ward, wardsInRegion]);

  const getAQIColor = (aqi: number) => {
    if (aqi > 300) return '#ff3b30';
    if (aqi > 200) return '#ff9500';
    if (aqi > 100) return '#ffcc00';
    return '#34c759';
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 35, stiffness: 220, ease: appleEase }}
        className={`fixed inset-y-0 right-0 z-[120] w-full md:w-[500px] lg:w-[600px] glass flex flex-col shadow-2xl backdrop-blur-3xl ${isDark ? 'text-white border-l border-white/10 bg-black/80' : 'bg-white text-[#1d1d1f]'}`}
      >
        <div className="px-10 pt-12 pb-8 flex items-start justify-between relative">
           <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                 <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                    Sovereign Registry Node
                 </div>
              </div>
              <h2 className="text-6xl font-black tracking-tighter leading-none mb-2 uppercase tabular-nums">{ward.name}</h2>
              <div className="flex items-center gap-4 opacity-40">
                <span className="text-[12px] font-black uppercase tracking-[0.4em]">Sector ${ward.id} • ${ward.zone}</span>
              </div>
           </div>
           <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-all">
             <X size={28} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-32 no-scrollbar space-y-12">
          
          {/* PRIMARY AQI PULSE */}
          <section className="flex items-end justify-between border-b border-white/5 pb-10">
             <div className="flex flex-col">
                <span className="text-[140px] font-black tracking-tighter leading-none text-cutout tabular-nums">{ward.aqi}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 mt-2">Integrated Response Index</span>
             </div>
             <div className="pb-4 flex flex-col items-end gap-3 text-right">
                <div 
                  className="px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em]"
                  style={{ borderColor: `${getAQIColor(ward.aqi)}44`, color: getAQIColor(ward.aqi), background: `${getAQIColor(ward.aqi)}10` }}
                >
                  {ward.status} PHASE
                </div>
                <div className="flex items-center gap-2 opacity-40">
                   <Activity size={12} />
                   <span className="text-[9px] font-bold uppercase tracking-widest">Nominal Telemetry</span>
                </div>
             </div>
          </section>

          {/* MINI ANALYTICAL SNAPSHOTS (SIDE-BY-SIDE) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* 24h Trend Snapshot */}
             <div className="p-8 rounded-[40px] bg-white/5 border border-white/5 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-30">24h Pulse</span>
                   <TrendingUp size={12} className="text-emerald-500" />
                </div>
                <div className="flex-1 flex items-end gap-1.5 h-16">
                   {[4, 7, 5, 8, 10, 6, 8, 12, 9, 11].map((h, i) => (
                     <div key={i} className="flex-1 bg-white/10 rounded-full" style={{ height: `${h * 8}%`, opacity: 0.2 + (i * 0.08) }} />
                   ))}
                </div>
                <span className="text-[10px] font-bold opacity-40 mt-4">+12% vs Mean Baseline</span>
             </div>

             {/* Regional Comparison Snapshot */}
             <div className="p-8 rounded-[40px] bg-white/5 border border-white/5 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Region Rank</span>
                   <LayoutGrid size={12} className="text-indigo-400" />
                </div>
                <div className="text-4xl font-black tracking-tighter mb-1">#{regionalRank}<span className="text-lg opacity-20">/ ${wardsInRegion.length}</span></div>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">In ${ward.region} Delhi</span>
             </div>
          </section>

          {/* POLLUTANT RATIO (COMPACT BAR) */}
          <section className="p-8 rounded-[40px] bg-white/5 border border-white/5">
             <div className="flex items-center justify-between mb-8">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Pollutant Composition</span>
                <Target size={12} className="opacity-20" />
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase tracking-tight opacity-40">Fine Particulate (PM2.5)</span>
                      <span className="text-xs font-black text-rose-500">{ward.pollutants.pm25} µg/m³</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500/60 rounded-full" style={{ width: `${Math.min(100, (ward.pollutants.pm25 / 400) * 100)}%` }} />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase tracking-tight opacity-40">Coarse Dust (PM10)</span>
                      <span className="text-xs font-black text-amber-500">{ward.pollutants.pm10} µg/m³</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${Math.min(100, (ward.pollutants.pm10 / 600) * 100)}%` }} />
                   </div>
                </div>
             </div>
          </section>

          {/* SOURCE FINGERPRINTING TRIGGER */}
          <section className="space-y-6">
            {!attribution ? (
               <div className="p-8 rounded-[48px] border border-white/5 bg-white/[0.02] flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                     <Fingerprint size={32} />
                  </div>
                  <div>
                     <h4 className="text-xl font-black uppercase tracking-tight mb-2">Source Attribution</h4>
                     <p className="text-xs opacity-40 font-medium max-w-[240px] mx-auto">Analyze atmospheric chemistry to identify the dominant pollution vector.</p>
                  </div>
                  <button 
                    onClick={handleSourceAnalysis}
                    disabled={analyzingSource}
                    className="w-full py-4 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {analyzingSource ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                    {analyzingSource ? 'Calibrating Sensors...' : 'Run Attribution Engine'}
                  </button>
               </div>
            ) : (
               <SourceAttributionCard attribution={attribution} theme={theme} />
            )}
          </section>

          {/* TACTICAL MITIGATION */}
          <section className="p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"><BrainCircuit size={140} /></div>
             <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                   <ShieldCheck size={20} className="text-indigo-400" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">Tactical Strategy Unit</h4>
             </div>
             {loading ? (
               <div className="space-y-4 animate-pulse">
                  <div className="h-10 bg-white/5 rounded-2xl" />
                  <div className="h-4 w-3/4 bg-white/5 rounded-full" />
               </div>
             ) : (
               <div className="space-y-8">
                  <p className="text-2xl font-black tracking-tighter leading-tight italic opacity-90">"{plan?.summary}"</p>
                  <ul className="space-y-5">
                     {plan?.steps.map((step, i) => (
                       <li key={i} className="flex gap-5 text-[13px] font-medium opacity-60 leading-relaxed">
                         <span className="text-indigo-400 font-black opacity-40 tabular-nums">0{i+1}</span> {step}
                       </li>
                     ))}
                  </ul>
                  <div className="pt-8 border-t border-indigo-500/10 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Plan Urgency</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      plan?.priority === 'High' ? 'text-rose-500' : 'text-indigo-400'
                    }`}>{plan?.priority} Priority</span>
                  </div>
               </div>
             )}
          </section>

        </div>
      </motion.div>
    </>
  );
};

export default WardDetail;
