import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Camera, MapPin, Send } from 'lucide-react';
import { DashboardTheme } from '../types';

interface CitizenActionProps {
  theme: DashboardTheme;
}

const CitizenAction: React.FC<CitizenActionProps> = ({ theme }) => {
  const [step, setStep] = useState<'upload' | 'submitting' | 'success'>('upload');
  const isDark = theme === 'dark';

  const handleSubmit = () => {
    setStep('submitting');
    setTimeout(() => setStep('success'), 2000);
  };

  return (
    <div className="glass-card rounded-[48px] p-10 md:p-14 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-8"
          >
            <div>
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Crowdsourced Intelligence</span>
              <h3 className="text-4xl font-black tracking-tight mb-4 leading-none">Report Hotspot</h3>
              <p className="opacity-40 text-lg">Direct pipeline to the environmental enforcement division.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-8 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${isDark ? 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/5' : 'border-black/10 bg-black/[0.01] hover:border-black/20 hover:bg-black/5'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                  <Camera className="opacity-40" size={28} />
                </div>
                <h4 className="text-sm font-bold mb-2">Capture / Drop Media</h4>
                <p className="text-[10px] opacity-20 uppercase tracking-widest">Image or MP4 Supported</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className={`rounded-2xl p-6 border flex items-center gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
                  <MapPin className="opacity-20" size={20} />
                  <div className="flex-1">
                    <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold mb-1">Current Location</p>
                    <p className="text-sm font-bold">Auto-detecting GPS coordinates...</p>
                  </div>
                </div>
                <textarea 
                  placeholder="Describe the violation (e.g. Garbage burning, industrial discharge)..."
                  className={`rounded-2xl p-6 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[140px] resize-none transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}
                />
                <button 
                  onClick={handleSubmit}
                  className="w-full py-5 rounded-full bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                >
                  <Send size={16} />
                  Transmit to Authority
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'submitting' && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative w-24 h-24 mb-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 border-4 border-t-indigo-500 rounded-full ${isDark ? 'border-indigo-500/10' : 'border-indigo-500/10'}`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Upload size={32} className="text-indigo-400 animate-bounce" />
              </div>
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">Encrypting Package</h3>
            <p className="opacity-40 text-sm tracking-widest uppercase">Establishing secure connection to CPCB nodes...</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
            <h3 className="text-4xl font-black tracking-tight mb-4">Transmission Confirmed</h3>
            <p className="opacity-40 text-lg mb-10 max-w-sm">
              Your report has been logged under ID #PX-2940 and assigned to the North-West Rapid Response Unit.
            </p>
            <button 
              onClick={() => setStep('upload')}
              className={`px-10 py-4 rounded-full border font-bold transition-colors ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitizenAction;