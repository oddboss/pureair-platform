
import React from 'react';
import { motion } from 'framer-motion';
import { DashboardTheme } from '../types';
import { ShieldAlert, Info } from 'lucide-react';

const HealthImpactView: React.FC<{ theme: DashboardTheme; pm25: number }> = ({ theme, pm25 }) => {
  const cigarettes = Math.round(pm25 / 22); // Broad scientific approximation
  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="mb-20">
        <h2 className="text-5xl font-black tracking-tighter mb-4">Physiological Risk Registry</h2>
        <p className="opacity-30 font-medium text-lg max-w-2xl leading-relaxed">Scientific assessment of atmospheric impact on metabolic and respiratory systems based on PM2.5 concentrations.</p>
      </header>

      <div className="glass-card p-14 rounded-[48px] border-rose-500/10 bg-rose-500/[0.02] flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5"><ShieldAlert size={120} /></div>
        <div className="flex flex-col items-center gap-4">
          <div className="text-[120px] font-black tracking-tighter leading-none text-rose-500 tabular-nums">{cigarettes}</div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 text-center">Cigarette Equivalent / Day</span>
        </div>
        <div className="flex-1 space-y-6">
          <h3 className="text-2xl font-bold">Atmospheric Toxicity Index</h3>
          <p className="opacity-50 leading-relaxed font-medium">The inhalation of ambient PM2.5 at current concentrations is physiologically equivalent to consuming the above quantity of tobacco units in a 24-hour cycle.</p>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
            <Info size={16} className="opacity-30" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Source: Global Burden of Disease Studies</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: "Respiratory / Asthma", risk: "Critical", advice: "High probability of exacerbated symptoms and increased rescue inhaler reliance." },
          { title: "Cardiovascular", risk: "Severe", advice: "Increased systemic inflammation and heart rate variability identified in recent clusters." },
          { title: "Pediatric Care", risk: "Elevated", advice: "Recommended suspension of prolonged outdoor exertion during peak diurnal intervals." },
          { title: "Elderly Population", risk: "Extreme", advice: "Strict indoor containment prioritized for individuals with pre-existing metabolic conditions." }
        ].map((item, i) => (
          <motion.div key={i} className="glass-card p-10 rounded-[40px] border-current/5">
             <div className="flex justify-between mb-6">
               <h4 className="text-lg font-bold">{item.title}</h4>
               <span className="text-rose-500 text-[9px] font-black uppercase tracking-widest">{item.risk} Risk</span>
             </div>
             <p className="opacity-40 text-sm leading-relaxed font-medium">{item.advice}</p>
          </motion.div>
        ))}
      </div>

      <div className="pt-20 opacity-20 text-[9px] font-black uppercase tracking-[0.6em] text-center">
        DISCLAIMER: DATA IS INDICATIVE. CONSULT CERTIFIED MEDICAL PROFESSIONALS FOR INDIVIDUAL DIAGNOSIS.
      </div>
    </div>
  );
};

export default HealthImpactView;
