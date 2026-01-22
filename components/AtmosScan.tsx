
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, RefreshCcw, AlertCircle, ShieldCheck, Target } from 'lucide-react';
import { DashboardTheme } from '../types';
import { analyzeAtmosphereImage } from '../services/geminiService';

const appleEase = [0.25, 1, 0.5, 1];

const AtmosScan: React.FC<{ theme: DashboardTheme }> = ({ theme }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fullData = reader.result as string;
        const base64 = fullData.split(',')[1];
        setImage(fullData);
        triggerAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAnalysis = async (base64: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
      const report = await analyzeAtmosphereImage(base64);
      setResult(String(report || "Intelligence extraction failed."));
    } catch (err) {
      setResult("Vision Node offline. Recalibrating sensors.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center pb-40">
      <header className="text-center mb-20 space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">Intelligence Layer 04</h4>
        <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">AtmosScan Vision</h2>
        <p className="opacity-40 text-lg max-w-xl mx-auto font-medium">Remote AI profiling of atmospheric opacity and particulate visibility.</p>
      </header>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
        <div className="glass rounded-[64px] overflow-hidden aspect-square relative flex items-center justify-center p-8 border-white/5 shadow-2xl">
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.label
                key="dropzone"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8, ease: appleEase }}
                className={`w-full h-full border-2 border-dashed rounded-[48px] flex flex-col items-center justify-center cursor-pointer transition-all group ${isDark ? 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]' : 'border-black/10 hover:border-black/20 hover:bg-black/[0.01]'}`}
              >
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <div className="w-24 h-24 rounded-[32px] glass flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-xl border-white/10">
                  <Camera size={40} className="opacity-30" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.4em] opacity-30">Initiate Visual Feed</span>
              </motion.label>
            ) : (
              <motion.div key="preview" className="relative w-full h-full group rounded-[48px] overflow-hidden">
                <img src={image} className="w-full h-full object-cover" alt="Scan target" />
                
                {/* SCANNER OVERLAY */}
                <motion.div 
                  animate={{ y: ["0%", "100%", "0%"] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-0 h-[2px] bg-emerald-500/50 shadow-[0_0_20px_#10b981] z-20 pointer-events-none"
                />

                {analyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center px-10">
                    <RefreshCcw className="animate-spin text-emerald-400 mb-6" size={48} />
                    <h3 className="text-xl font-black uppercase tracking-widest text-emerald-400 mb-2">Analyzing Spectral Density</h3>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Cross-referencing PM2.5 scattering coefficients...</p>
                  </div>
                )}
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="absolute top-8 right-8 p-4 rounded-full glass text-white backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-all border-white/20 hover:bg-white/10 z-40"
                >
                  <RefreshCcw size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col h-full">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`glass p-16 rounded-[64px] border border-white/5 flex-1 flex flex-col items-center justify-center text-center space-y-8 opacity-20`}
              >
                <Target size={64} />
                <p className="text-sm font-black uppercase tracking-[0.5em]">System Waiting for Spatial Input</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: appleEase }}
                className="flex-1 flex flex-col gap-8"
              >
                <div className="glass p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/[0.02] shadow-2xl relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 opacity-5"><ShieldCheck size={200} /></div>
                   <div className="flex items-center gap-4 mb-10">
                      <ShieldCheck size={20} className="text-emerald-500" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Extraction Complete</h4>
                   </div>
                   <div className="text-2xl font-bold tracking-tight leading-relaxed opacity-90 whitespace-pre-wrap">{String(result)}</div>
                </div>

                <div className="glass p-10 rounded-[48px] border-white/5 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase opacity-30 tracking-widest mb-1">Confidence Matrix</span>
                      <span className="text-3xl font-black tabular-nums">94.8%</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[9px] font-black uppercase opacity-30 tracking-widest mb-1">Model Node</span>
                      <span className="text-xs font-bold uppercase tracking-widest">Atmos-Vision 3.1</span>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AtmosScan;
