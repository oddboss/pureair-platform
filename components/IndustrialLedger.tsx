import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DashboardTheme, Factory } from '../types';
import { Scale, Factory as FactoryIcon, AlertTriangle, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';

const MOCK_FACTORIES: Factory[] = [
  { id: 'f1', name: 'Okhla Steel Synthesis', zone: 'South Delhi', compliance: 'Non-Compliant', emissions: '420 µg/m³', lastInspection: 'Oct 12, 2024', violationCount: 3 },
  { id: 'f2', name: 'Wazirpur Dyeing Unit B', zone: 'North Delhi', compliance: 'Suspended', emissions: '0 µg/m³', lastInspection: 'Nov 02, 2024', violationCount: 8 },
  { id: 'f3', name: 'Mayapuri Metals Ltd', zone: 'West Delhi', compliance: 'Active', emissions: '110 µg/m³', lastInspection: 'Nov 15, 2024', violationCount: 0 },
  { id: 'f4', name: 'Bawana Plastic Node 4', zone: 'North-West Delhi', compliance: 'Under-Review', emissions: '280 µg/m³', lastInspection: 'Oct 28, 2024', violationCount: 1 },
  { id: 'f5', name: 'Narela Chemical Hub', zone: 'Narela', compliance: 'Non-Compliant', emissions: '512 µg/m³', lastInspection: 'Oct 05, 2024', violationCount: 5 }
];

const IndustrialLedger: React.FC<{ theme: DashboardTheme }> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  const stats = useMemo(() => {
    return {
      active: MOCK_FACTORIES.filter(f => f.compliance === 'Active').length,
      violators: MOCK_FACTORIES.filter(f => f.compliance === 'Non-Compliant').length,
      suspended: MOCK_FACTORIES.filter(f => f.compliance === 'Suspended').length
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="max-w-xl">
           <div className="flex items-center gap-3 mb-6">
              <Scale size={20} className="text-rose-500" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Environmental Enforcement</h4>
           </div>
           <h2 className="text-6xl font-black tracking-tighter mb-4 leading-none uppercase">Industrial Compliance Ledger</h2>
           <p className="opacity-40 text-lg font-medium leading-relaxed">Official registry of industrial emissions and DPCC inspection status across the NCT zone.</p>
        </div>
        <div className="flex gap-4">
           {[
             { label: 'Violators', val: stats.violators, color: 'text-rose-500' },
             { label: 'Suspended', val: stats.suspended, color: 'text-indigo-500' },
             { label: 'Compliant', val: stats.active, color: 'text-emerald-500' }
           ].map((s, i) => (
             <div key={i} className="glass px-10 py-6 rounded-[32px] text-center border-white/5">
                <div className={`text-4xl font-black ${s.color}`}>{String(s.val)}</div>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-30">{String(s.label)}</span>
             </div>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
         {MOCK_FACTORIES.map((factory, i) => (
           <motion.div
             key={factory.id}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.05 }}
             className="glass p-8 md:p-12 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-10 group hover:bg-white/[0.03] transition-all border-white/5"
           >
              <div className="flex items-center gap-10 flex-1">
                 <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                    <FactoryIcon size={24} className="opacity-20 group-hover:opacity-60 transition-opacity" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-1">{String(factory.name)}</h3>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{String(factory.zone)}</span>
                       <span className="w-1 h-1 rounded-full bg-white/20" />
                       <span className="text-[10px] font-bold opacity-30">Last Inspection: {String(factory.lastInspection)}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-12">
                 <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-20 block mb-1">Stack Emissions</span>
                    <span className={`text-2xl font-black tabular-nums ${factory.emissions === '0 µg/m³' ? 'opacity-20' : 'text-rose-500'}`}>{String(factory.emissions)}</span>
                 </div>
                 
                 <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-20 block mb-2">Compliance Status</span>
                    <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      factory.compliance === 'Active' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                      factory.compliance === 'Non-Compliant' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 
                      'text-indigo-500 border-indigo-500/20 bg-indigo-500/5'
                    }`}>
                      {String(factory.compliance)}
                    </div>
                 </div>

                 {factory.violationCount > 0 && (
                   <div className="w-12 h-12 rounded-full border border-rose-500/20 flex items-center justify-center relative group/tip">
                      <ShieldAlert size={18} className="text-rose-500" />
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                        {String(factory.violationCount)}
                      </div>
                      <div className="absolute bottom-full mb-4 opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none">
                         <div className="glass px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border-rose-500/20 whitespace-nowrap">
                           Repeat Offender History
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </motion.div>
         ))}
      </div>

      <div className="p-14 rounded-[56px] border border-rose-500/20 bg-rose-500/[0.02] flex items-center justify-between">
         <div className="flex items-center gap-10">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
               <AlertTriangle size={24} className="text-rose-500" />
            </div>
            <div>
               <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">Automated Digital Citation (AI-Enforced)</h3>
               <p className="opacity-40 text-sm max-w-lg font-medium">Non-compliant units are automatically flagged for physical verification. Citations are generated using Gemini AtmosVision vision nodes.</p>
            </div>
         </div>
         <button className="px-8 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
           Generate Registry Report
         </button>
      </div>
    </div>
  );
};

export default IndustrialLedger;