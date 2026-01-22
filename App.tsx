
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, animate, useScroll, useTransform } from 'framer-motion';
import { 
  Search, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Activity,
  Zap,
  Clock,
  AlertCircle,
  ShieldAlert,
  Map as MapIcon,
  LayoutGrid,
  BarChart3,
  Camera,
  Users,
  Heart,
  ChevronRight,
  BrainCircuit,
  Scale
} from 'lucide-react';

import MeshBackground from './components/MeshBackground';
import SearchOverlay from './components/SearchOverlay';
import WardDetail from './components/WardDetail';
import RankingsView from './components/RankingsView';
import AnalyticsView from './components/AnalyticsView';
import HealthImpactView from './components/HealthImpactView';
import MethodologyView from './components/MethodologyView';
import AtmosScan from './components/AtmosScan';
import GovSections from './components/GovSections';
import IndustrialLedger from './components/IndustrialLedger';
import WardMap from './components/WardMap';
import GeminiAssistant from './components/GeminiAssistant';
import CivicPulse from './components/CivicPulse';
import ForecastView from './components/ForecastView';
import Particles from './components/Particles';

import { loadDelhiWards } from './data';
import { Ward, DashboardTheme, AppView, AQILevel } from './types';
import { fetchLiveCityAQI, LiveAqiData } from './services/aqiService';
import { getMitigationInsight } from './services/geminiService';

const appleEase = [0.25, 1, 0.5, 1];

const Counter: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1.5,
      ease: appleEase,
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <>{displayValue}</>;
};

const IntelligenceBulletin: React.FC = () => (
  <div className="w-full bg-rose-500/10 border-y border-rose-500/20 py-2.5 overflow-hidden whitespace-nowrap z-[60] backdrop-blur-md alert-ticker-container">
    <motion.div 
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      className="flex items-center gap-16 px-8"
    >
      {[1, 2].map((_, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-rose-500">
            <AlertCircle size={10} /> Validated Hotspot: Illegal Burning in Okhla Node 03
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">
            <ShieldAlert size={10} /> GRAP Stage IV Active: Truck entry restrictions in effect
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">
            <Activity size={10} /> Thermal Inversion Probability: 84% for next 06 hours
          </div>
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

const FeatureCard: React.FC<{ 
  icon: any; 
  title: string; 
  description: string; 
  onClick: () => void;
  isDark: boolean;
}> = ({ icon: Icon, title, description, onClick, isDark }) => (
  <motion.button
    whileHover={{ y: -10, scale: 1.02 }}
    onClick={onClick}
    className={`p-10 rounded-[48px] glass border text-left flex flex-col gap-6 transition-colors ${
      isDark ? 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]' : 'border-black/5 bg-black/[0.01] hover:bg-black/[0.02]'
    }`}
  >
    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center border-white/5">
      <Icon size={22} className="opacity-60" />
    </div>
    <div>
      <h3 className="text-xl font-black uppercase tracking-tight mb-2">{title}</h3>
      <p className="opacity-40 text-[13px] font-medium leading-relaxed">{description}</p>
    </div>
    <div className="mt-auto pt-6 flex items-center gap-2 opacity-20">
      <span className="text-[10px] font-black uppercase tracking-widest">Execute Node</span>
      <ChevronRight size={12} />
    </div>
  </motion.button>
);

const App: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [view, setView] = useState<AppView>('home');
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [theme, setTheme] = useState<DashboardTheme>('dark');
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Live AQI State
  const [liveAqi, setLiveAqi] = useState<LiveAqiData | null>(null);
  const [mitigationInsight, setMitigationInsight] = useState<{ text: string; confidence: string } | null>(null);

  const { scrollY } = useScroll();
  const stripOpacity = useTransform(scrollY, [200, 400], [0, 1]);
  const stripY = useTransform(scrollY, [200, 400], [-20, 0]);

  useEffect(() => {
    const init = async () => {
      const data = await loadDelhiWards();
      setWards(data);
      refreshLiveAQI();
      setLoading(false);
    };
    init();

    const interval = setInterval(refreshLiveAQI, 300000); // 5 min
    return () => clearInterval(interval);
  }, []);

  const refreshLiveAQI = async () => {
    const live = await fetchLiveCityAQI();
    if (live) {
      setLiveAqi(live);
      const insight = await getMitigationInsight(live.aqi, live.dominant);
      setMitigationInsight(insight);
    }
  };

  const avgAqi = liveAqi?.aqi || 0;
  const isDark = theme === 'dark';

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const getAqiStatusLabel = (aqi: number) => {
    if (aqi > 300) return { label: 'SEVERE', color: 'border-rose-500 text-rose-500', bg: 'bg-rose-500/10' };
    if (aqi > 200) return { label: 'POOR', color: 'border-amber-500 text-amber-500', bg: 'bg-amber-500/10' };
    if (aqi > 100) return { label: 'MODERATE', color: 'border-emerald-500 text-emerald-500', bg: 'bg-emerald-500/10' };
    return { label: 'GOOD', color: 'border-green-400 text-green-400', bg: 'bg-green-400/10' };
  };

  const status = getAqiStatusLabel(avgAqi);

  const renderView = () => {
    switch (view) {
      case 'rankings': return <RankingsView theme={theme} wards={wards} onSelect={setSelectedWard} />;
      case 'analytics': return <AnalyticsView theme={theme} />;
      case 'health': return <HealthImpactView theme={theme} pm25={Math.round(avgAqi * 0.7)} />;
      case 'methodology': return <MethodologyView theme={theme} />;
      case 'scan': return <AtmosScan theme={theme} />;
      case 'enforcement': 
      case 'governance': return (
        <div className="space-y-40 pb-40">
           <GovSections theme={theme} />
           <IndustrialLedger theme={theme} />
        </div>
      );
      case 'pulse': return <CivicPulse theme={theme} wards={wards} onNavigate={setView} setTheme={setTheme} />;
      case 'forecast': return <ForecastView currentAqi={avgAqi} theme={theme} />;
      default: return (
        <div className="space-y-40 pb-40">
          {/* IMMERSIVE HERO */}
          <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: appleEase }}
              className="mb-8"
            >
              <span className="text-[10px] font-black uppercase tracking-[1em] opacity-40">
                {liveAqi?.city || 'DELHI NCT'} ATMOSPHERIC NODE
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: appleEase }}
              className="flex flex-col items-center"
            >
              <div className="text-[260px] font-black tracking-tighter tabular-nums leading-none text-cutout relative">
                <Counter value={avgAqi} />
                <motion.div 
                  className="absolute -inset-20 blur-[120px] opacity-20 -z-10"
                  style={{ backgroundColor: status.color.split(' ')[1].replace('text-', '') }}
                />
              </div>
              
              <div className="flex flex-col items-center gap-6 -mt-10 relative z-10">
                <div className={`px-10 py-3 rounded-full border-2 ${status.color} ${status.bg} backdrop-blur-3xl font-black text-xs tracking-[0.4em] shadow-2xl`}>
                  {status.label} PHASE
                </div>
                <div className="flex items-center gap-4 opacity-40">
                  <span className="text-[11px] font-black uppercase tracking-[0.5em]">{liveAqi?.dominant || 'PM2.5'} Dominant</span>
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em]">Live Feed: {liveAqi?.time}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-10 flex flex-col items-center gap-4"
            >
              <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-transparent" />
              <span className="text-[9px] font-black uppercase tracking-[0.6em] opacity-20">Scroll to Decrypt Intelligence</span>
            </motion.div>
          </section>

          {/* AI MITIGATION INSIGHT (Decision Support) */}
          <AnimatePresence>
            {mitigationInsight && (
              <section className="max-w-4xl mx-auto px-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-14 rounded-[64px] border border-indigo-500/20 bg-indigo-500/[0.03] backdrop-blur-3xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <BrainCircuit size={160} />
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <ShieldCheck size={20} className="text-indigo-400" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">AI Mitigation Insight</h4>
                    <div className="ml-auto flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Confidence: {mitigationInsight.confidence}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-black tracking-tight leading-relaxed italic opacity-90 whitespace-pre-wrap">
                    "{mitigationInsight.text}"
                  </p>
                  <div className="mt-10 pt-10 border-t border-indigo-500/10">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-20 italic">Generated for Decision Support Node Delhi-NCT</span>
                  </div>
                </motion.div>
              </section>
            )}
          </AnimatePresence>

          {/* FEATURE DISCOVERY CARDS */}
          <section className="px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard 
              icon={MapIcon} 
              title="Spatial Map" 
              description="Ward-wise micro-climate surveillance for 274 municipal sectors."
              onClick={() => {}} // Map is shown below, but this anchors the thought
              isDark={isDark}
            />
            <FeatureCard 
              icon={Clock} 
              title="Predictive Forecast" 
              description="72-hour temporal intelligence powered by atmospheric chemistry models."
              onClick={() => setView('forecast')}
              isDark={isDark}
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Analytic Pulse" 
              description="Deep-dive into hourly exposure trends and pollutant composition profiles."
              onClick={() => setView('analytics')}
              isDark={isDark}
            />
            <FeatureCard 
              icon={Camera} 
              title="AtmosScan Vision" 
              description="Remote AI profiling of particulate visibility using spectral density nodes."
              onClick={() => setView('scan')}
              isDark={isDark}
            />
            <FeatureCard 
              icon={Users} 
              title="Civic Pulse" 
              description="Real-time crowdsourced reports and neighborhood hotspot validation."
              onClick={() => setView('pulse')}
              isDark={isDark}
            />
            <FeatureCard 
              icon={Heart} 
              title="Health Registry" 
              description="Physiological risk assessment based on tobacco-equivalent toxicity mapping."
              onClick={() => setView('health')}
              isDark={isDark}
            />
            <FeatureCard 
              icon={Scale} 
              title="Governance" 
              description="Compliance ledger, GRAP protocols, and strategic enforcement nodes."
              onClick={() => setView('governance')}
              isDark={isDark}
            />
          </section>

          {/* SPATIAL MONITORING (WARD MAP) */}
          <section className="px-6 md:px-20">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                  <MapIcon size={18} className="opacity-40" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest">Spatial Monitoring Node</h2>
              </div>
              <button onClick={() => setSearchOpen(true)} className="glass px-6 py-3 rounded-full flex items-center gap-3 hover:bg-white/5 transition-all group">
                <Search size={14} className="opacity-40" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Search Sectors</span>
              </button>
            </div>
            <WardMap 
              wards={wards} 
              simulationHour={0} 
              onSelect={setSelectedWard} 
              theme={theme} 
              onNavigate={setView} 
            />
          </section>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="w-24 h-24 relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-b-2 border-indigo-500 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={32} className="text-indigo-400 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-black uppercase tracking-[0.4em] text-white/40">PureAir Systems</h2>
          <p className="text-[9px] font-black uppercase tracking-[0.8em] text-indigo-500/40 mt-2">Initializing Atmospheric Core</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${isDark ? 'text-white' : 'text-black'}`}>
      <MeshBackground theme={theme} aqi={avgAqi} />
      <Particles theme={theme} />
      
      {view !== 'pulse' && <IntelligenceBulletin />}

      {/* STICKY INTELLIGENCE STRIP */}
      <motion.div 
        style={{ opacity: stripOpacity, y: stripY }}
        className="fixed top-0 left-0 right-0 z-[90] pointer-events-none px-6 pt-6"
      >
        <div className="max-w-4xl mx-auto glass rounded-full border border-white/10 px-8 py-3 flex items-center justify-between pointer-events-auto shadow-2xl backdrop-blur-3xl">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Zap size={16} className="text-indigo-400" />
             </div>
             <span className="text-[16px] font-black tabular-nums">{avgAqi} AQI</span>
             <div className="w-1 h-1 rounded-full bg-white/20" />
             <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{liveAqi?.dominant || 'PM2.5'} Dominant</span>
          </div>
          <div className="flex items-center gap-6">
             <div className={`px-4 py-1 rounded-full border text-[9px] font-black tracking-widest ${status.color} ${status.bg}`}>
                GRAP STAGE I
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Updated {liveAqi?.time}</span>
          </div>
        </div>
      </motion.div>

      <header className={`fixed top-0 left-0 right-0 z-[80] px-10 py-8 pointer-events-none transition-opacity duration-500`}>
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('home')}>
             <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center border-white/10 shadow-xl overflow-hidden relative">
                <Zap size={22} className="text-indigo-400 relative z-10" />
             </div>
             <span className="text-lg font-black tracking-tighter uppercase">PureAir</span>
          </div>

          <nav className="hidden lg:flex glass px-8 py-3 rounded-full border-white/5 items-center gap-6">
            {[
              { label: 'Map', id: 'home', icon: MapIcon },
              { label: 'Rankings', id: 'rankings', icon: LayoutGrid },
              { label: 'Analytics', id: 'analytics', icon: BarChart3 },
              { label: 'Forecast', id: 'forecast', icon: Clock },
              { label: 'Health', id: 'health', icon: Heart },
              { label: 'Vision', id: 'scan', icon: Camera },
              { label: 'Pulse', id: 'pulse', icon: Users },
              { label: 'Governance', id: 'governance', icon: Scale },
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setView(item.id as AppView)}
                className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-100 flex items-center gap-2 ${view === item.id ? 'opacity-100 text-indigo-400' : 'opacity-30'}`}
              >
                <item.icon size={12} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
             <button onClick={toggleTheme} className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:scale-105 transition-transform border-white/5">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             <button 
               onClick={() => setView('governance')}
               className="hidden md:flex px-8 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
             >
               Registry
             </button>
          </div>
        </div>
      </header>

      <main className={`relative z-10 ${view === 'pulse' ? 'pt-0' : 'pt-24'}`}>
        {renderView()}
      </main>

      <GeminiAssistant currentAqi={avgAqi} theme={theme} />

      <AnimatePresence>
        {selectedWard && (
          <WardDetail 
            ward={selectedWard} 
            theme={theme} 
            wardsInRegion={wards.filter(w => w.region === selectedWard.region)} 
            onClose={() => setSelectedWard(null)} 
          />
        )}
        {searchOpen && (
          <SearchOverlay 
            wards={wards} 
            onClose={() => setSearchOpen(false)} 
            onSelect={(w) => { setSelectedWard(w); setSearchOpen(false); }} 
          />
        )}
      </AnimatePresence>

      {view !== 'pulse' && (
        <footer className="py-20 px-10 border-t border-white/5 text-center opacity-20">
          <span className="text-[10px] font-black uppercase tracking-[0.8em]">End of Transmission • Delhi NCT Environment Node</span>
        </footer>
      )}
    </div>
  );
};

export default App;
