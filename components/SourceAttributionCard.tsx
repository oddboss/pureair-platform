
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Factory, 
  Flame, 
  Wind, 
  Construction, 
  Zap, 
  ShieldCheck, 
  Share2,
  Info
} from 'lucide-react';
import { SourceAttribution, DashboardTheme } from '../types';

interface SourceAttributionCardProps {
  attribution: SourceAttribution;
  theme: DashboardTheme;
}

const SourceAttributionCard: React.FC<SourceAttributionCardProps> = ({ attribution, theme }) => {
  const isDark = theme === 'dark';

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'vehicular': return <Car size={24} />;
      case 'industrial': return <Factory size={24} />;
      case 'biomass': return <Flame size={24} />;
      case 'regional': return <Wind size={24} />;
      case 'construction': return <Construction size={24} />;
      default: return <Zap size={24} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-10 rounded-[48px] border overflow-hidden relative group ${
        isDark ? 'bg-white/[0.03] border-white/5 shadow-2xl' : 'bg-black/[0.02] border-black/5 shadow-xl'
      }`}
    >
      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
        <Zap size={100} />
      </div>

      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">Source Intelligence Node</h4>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Confidence: {attribution.confidenceScore}%</span>
               <div className="w-1 h-1 rounded-full bg-indigo-500/40" />
               <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">AtmosModel v3.1</span>
            </div>
          </div>
        </div>
        <button className="p-3 rounded-full hover:bg-white/5 transition-colors opacity-30">
          <Share2 size={16} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-10">
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/5">
             <span className="text-[9px] font-black uppercase tracking-widest opacity-20 block mb-4">Dominant Vector</span>
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  {getSourceIcon(attribution.dominantSource.type)}
                </div>
                <div>
                   <h3 className="text-3xl font-black tracking-tight leading-none uppercase">{attribution.dominantSource.label}</h3>
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mt-2 block">
                     Attribution Certainty: {attribution.dominantSource.confidence}%
                   </span>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <span className="text-[9px] font-black uppercase tracking-widest opacity-20 block">Secondary Contributions</span>
             {attribution.secondarySources.map((source, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-bold opacity-60 uppercase tracking-tight">{source.label}</span>
                    <span className="text-[10px] font-black opacity-40">{source.weight}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${source.weight}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full bg-indigo-500/40 rounded-full"
                    />
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
           <div className="p-8 rounded-[32px] border border-white/5 flex-1">
              <div className="flex items-center gap-3 mb-6">
                 <Info size={16} className="opacity-20" />
                 <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Logical Derivation</span>
              </div>
              <ul className="space-y-4">
                 {attribution.reasoning.map((reason, i) => (
                   <li key={i} className="flex gap-4 text-sm font-medium opacity-60 leading-relaxed group">
                     <span className="text-indigo-400 font-black opacity-30 tabular-nums">0{i+1}</span> {reason}
                   </li>
                 ))}
              </ul>
           </div>

           <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-500/5 border-indigo-500/10'}`}>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Intelligence Snippet</span>
                 <Share2 size={12} className="opacity-20" />
              </div>
              <p className="text-lg font-black tracking-tight leading-tight italic opacity-80">
                "{attribution.socialSnippet}"
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SourceAttributionCard;
