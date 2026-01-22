
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Hash, Building2, ChevronRight } from 'lucide-react';
import { Ward } from '../types';

interface SearchOverlayProps {
  onClose: () => void;
  onSelect: (ward: Ward) => void;
  wards: Ward[];
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, onSelect, wards }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const lower = query.toLowerCase();
    return wards.filter(w => 
      w.name.toLowerCase().includes(lower) || 
      w.zone.toLowerCase().includes(lower) ||
      w.id.toLowerCase().includes(lower)
    ).slice(0, 10);
  }, [query, wards]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-start justify-center pt-[15vh] px-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.98 }}
        className="w-full max-w-2xl glass rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-8 py-6 border-b border-white/10">
          <Search size={20} className="opacity-20 mr-4" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search 274 Wards or Zones..."
            className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:opacity-20 text-white"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-2 opacity-20 hover:opacity-100 transition-opacity">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 max-h-[60vh] overflow-y-auto no-scrollbar p-4">
          {results.length > 0 ? (
            <div className="space-y-2">
              <span className="px-4 text-[9px] font-black uppercase tracking-widest opacity-20">Spatial Intelligence Results</span>
              {results.map((ward) => (
                <button
                  key={ward.id}
                  onClick={() => onSelect(ward)}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-white/5 transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-40">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold">{String(ward.name)}</h4>
                      <p className="text-[10px] opacity-30 font-black uppercase tracking-widest">{String(ward.zone)} • {ward.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <span className="text-xl font-black tracking-tighter block tabular-nums">{Number(ward.aqi)}</span>
                       <span className="text-[8px] font-black uppercase opacity-20">AQI</span>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-20 text-center opacity-20">
               <Building2 size={40} className="mx-auto mb-4" />
               <p className="text-sm font-bold uppercase tracking-widest">No matching sectors identified</p>
            </div>
          ) : (
            <div className="py-20 text-center opacity-20">
               <Hash size={40} className="mx-auto mb-4" />
               <p className="text-sm font-bold uppercase tracking-widest">Type to search the NCT registry</p>
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center gap-6 opacity-30">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase">
            <span className="px-1.5 py-0.5 rounded bg-white/10">↑↓</span> <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase">
            <span className="px-1.5 py-0.5 rounded bg-white/10">↵</span> <span>Select</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchOverlay;
