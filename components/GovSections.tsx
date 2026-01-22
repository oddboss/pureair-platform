import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardTheme, GroundingChunk } from '../types';
import { ShieldCheck, Truck, Construction, Factory, Zap, Map, TrendingUp, Radio, ExternalLink } from 'lucide-react';
import { getLiveGovUpdates } from '../services/geminiService';

interface GovSectionsProps {
  theme: DashboardTheme;
}

const GovSections: React.FC<GovSectionsProps> = ({ theme }) => {
  const [liveNews, setLiveNews] = useState<{ text: string, sources: GroundingChunk[] } | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      const data = await getLiveGovUpdates();
      setLiveNews({
        text: String(data.text || "Standard protocols active."),
        sources: Array.isArray(data.sources) ? data.sources : []
      });
      setLoadingNews(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-12 md:px-32 space-y-40">
      <section className={`rounded-[48px] p-12 overflow-hidden relative border ${isDark ? 'bg-indigo-500/[0.03] border-indigo-500/20' : 'bg-indigo-500/[0.01] border-indigo-500/10'}`}>
        <div className="flex items-center gap-3 mb-8">
          <Radio size={16} className="text-rose-500 animate-pulse" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Live Regulatory Intelligence</h4>
        </div>
        
        {loadingNews ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-3/4 bg-current opacity-5 rounded-xl" />
            <div className="h-4 w-1/2 bg-current opacity-5 rounded-xl" />
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-2xl font-bold tracking-tight leading-tight max-w-4xl">
              {String(liveNews?.text || "Telemetry online. Monitoring latest CAQM bulletins.")}
            </p>
            {liveNews?.sources && liveNews.sources.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {liveNews.sources.map((src, i) => {
                  if (!src || !src.web) return null;
                  return (
                    <a 
                      key={i} 
                      href={src.web.uri} 
                      target="_blank" 
                      rel="noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}
                    >
                      {String(src.web.title)} <ExternalLink size={10} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-8">Intelligence Layer 01</h4>
          <h2 className="text-5xl font-black tracking-tighter mb-8 leading-[0.9]">Government Air Quality Guidelines</h2>
          <p className="opacity-40 text-lg max-w-lg leading-relaxed font-medium">Official protocols issued by the Commission for Air Quality Management (CAQM) under the Graded Response Action Plan (GRAP).</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { stage: "Stage 1", level: "Poor", desc: "Thermal power plants monitored, construction dust mitigation enforced." },
            { stage: "Stage 2", level: "Very Poor", desc: "Diesel generator use restricted, coal/firewood burning prohibited." },
            { stage: "Stage 3", level: "Severe", desc: "All non-essential construction halted, brick kilns suspended." },
            { stage: "Stage 4", level: "Severe+", desc: "Truck entry restricted, odd-even rules, school closures active." }
          ].map((item, i) => (
            <div key={i} className={`p-8 rounded-[32px] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.01] border-black/5'}`}>
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">{String(item.stage)}</span>
                <span className="text-[10px] font-bold opacity-30">{String(item.level)}</span>
              </div>
              <p className="text-xs opacity-60 font-medium leading-relaxed">{String(item.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="text-center mb-20">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-8">Intelligence Layer 02</h4>
          <h2 className="text-5xl font-black tracking-tighter mb-8">Active Enforcement Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: Truck, label: "Traffic Regulation", status: "Active", detail: "Ban on BS-III Petrol & BS-IV Diesel vehicles in specified zones." },
            { icon: Construction, label: "Dust Suppression", status: "Active", detail: "24/7 water sprinkling and mechanized sweeping on high-density corridors." },
            { icon: Factory, label: "Industrial Control", status: "Planned", detail: "Transition of manufacturing units to PNG/Clean-Fuel grid." }
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <div key={i} className={`p-12 rounded-[48px] border flex flex-col items-center text-center transition-all hover:scale-[1.02] ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.01] border-black/5'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                  <Icon size={28} className="opacity-40" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{String(action.label)}</h3>
                <p className="text-sm opacity-40 mb-10 leading-relaxed font-medium">{String(action.detail)}</p>
                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${action.status === 'Active' ? 'text-emerald-500 border-emerald-500/20' : 'text-indigo-500 border-indigo-500/20'}`}>
                  {String(action.status)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={`rounded-[64px] p-20 overflow-hidden relative ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}>
        <div className="relative z-10 flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-8">Intelligence Layer 03</h4>
            <h2 className="text-5xl font-black tracking-tighter mb-8 leading-[0.95]">Strategic Action Plan</h2>
            <p className="opacity-40 text-lg leading-relaxed font-medium mb-12">The 2025-2030 roadmap focused on structural decarbonization.</p>
            <div className="space-y-6">
              {[
                "Accelerated EV transition for commercial fleets.",
                "Completion of 33% green buffer zone.",
                "Real-time micro-sensor deployment."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <ShieldCheck size={18} className="text-emerald-500 opacity-50" />
                  <span className="text-sm font-bold opacity-60">{String(text)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-8">
            {[
              { label: "Public Transport", val: "+2k EVs", icon: Zap },
              { label: "New Sensors", val: "500+", icon: Map },
              { label: "Green Cover", val: "+12%", icon: TrendingUp },
              { label: "Target AQI", val: "-40%", icon: ShieldCheck }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className={`p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                  <Icon size={20} className="opacity-20 mb-6" />
                  <div className="text-3xl font-black tracking-tighter mb-1">{String(stat.val)}</div>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{String(stat.label)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GovSections;