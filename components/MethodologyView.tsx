
import React from 'react';
import { ShieldCheck, Database, Zap, Map } from 'lucide-react';
/* Import DashboardTheme to fix "Cannot find name 'DashboardTheme'" error */
import { DashboardTheme } from '../types';

const MethodologyView: React.FC<{ theme: DashboardTheme }> = ({ theme }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-20">
        <h2 className="text-5xl font-black tracking-tighter mb-4">Methodology & Source Registry</h2>
        <p className="opacity-30 font-medium text-lg">Transparent disclosure of data acquisition and processing protocols.</p>
      </header>

      <div className="space-y-12">
        <section className="glass-card p-14 rounded-[48px] flex gap-10">
          <Database className="opacity-20 shrink-0" size={40} />
          <div>
            <h3 className="text-2xl font-bold mb-6">Primary Sensor Network</h3>
            <p className="opacity-50 leading-relaxed font-medium mb-8">Data is ingested directly from the Central Pollution Control Board (CPCB) and Delhi Pollution Control Committee (DPCC) monitoring stations. We prioritize official government telemetry for administrative accuracy.</p>
            <div className="flex gap-8">
              <div className="flex flex-col gap-1"><span className="text-[10px] font-bold uppercase opacity-30">Active Sensors</span><span className="text-xl font-black">40+ Units</span></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] font-bold opacity-30">Accuracy</span><span className="text-xl font-black">Grade-A Lab</span></div>
            </div>
          </div>
        </section>

        <section className="glass-card p-14 rounded-[48px] flex gap-10">
          <Zap className="opacity-20 shrink-0" size={40} />
          <div>
            <h3 className="text-2xl font-bold mb-6">Calculation Standards</h3>
            <p className="opacity-50 leading-relaxed font-medium">PureAir utilizes the AirNow (US-EPA) sub-index calculation method for PM2.5 and PM10, providing a more granular risk assessment than the standard linear mapping. All thresholds are cross-referenced with WHO Guidelines 2021.</p>
          </div>
        </section>

        <section className="glass-card p-14 rounded-[48px] flex gap-10">
          <Map className="opacity-20 shrink-0" size={40} />
          <div>
            <h3 className="text-2xl font-bold mb-6">Fallback & Spatial Logic</h3>
            <p className="opacity-50 leading-relaxed font-medium">When a specific ward-level sensor reports an offline status, our system applies a 'Nearest Valid Node' logic, snapping to the closest functioning CPCB station within a 5km radius to maintain data continuity.</p>
          </div>
        </section>
      </div>

      <div className="mt-20 p-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.02] flex items-center gap-6">
        <ShieldCheck className="text-emerald-500" size={24} />
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-500/80">Systems verified for NCT defense operations.</span>
      </div>
    </div>
  );
};

export default MethodologyView;
