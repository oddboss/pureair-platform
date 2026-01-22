
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ward, AQILevel } from '../types';

interface SpatialNodesProps {
  wards: Ward[];
  simulationHour: number;
  onSelect: (ward: Ward) => void;
  theme: 'dark' | 'light';
}

const SpatialNodes: React.FC<SpatialNodesProps> = ({ wards, simulationHour, onSelect, theme }) => {
  const isDark = theme === 'dark';

  // We generate a "pseudo-spatial" grid for all 274 wards
  const nodes = useMemo(() => {
    return wards.map((w, i) => {
      // Calculate a stable but randomish position based on ID for grid-like feel
      const seed = parseInt(w.id) * 1337;
      const x = (seed % 90) + 5; // 5% to 95%
      const y = ((seed / 10) % 90) + 5;
      
      // Shift AQI based on simulation
      const shift = Math.sin(simulationHour / 4 + i) * 30;
      const currentAqi = Math.max(10, Math.round(w.aqi + shift));
      
      let color = '#34c759'; // Good
      if (currentAqi > 300) color = '#ff3b30'; // Hazardous
      else if (currentAqi > 200) color = '#ff9500'; // Poor
      else if (currentAqi > 100) color = '#ffcc00'; // Moderate

      return { ...w, x, y, currentAqi, color };
    });
  }, [wards, simulationHour]);

  return (
    <div className="relative w-full aspect-square md:aspect-[16/9] glass border-white/5 rounded-[64px] overflow-hidden p-8 mb-20">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }} />
      </div>
      
      <div className="relative w-full h-full">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={false}
            animate={{ 
              x: `${node.x}%`, 
              y: `${node.y}%`,
              backgroundColor: node.color,
              boxShadow: `0 0 ${Math.max(4, node.currentAqi / 20)}px ${node.color}`
            }}
            whileHover={{ scale: 3, zIndex: 50 }}
            onClick={() => onSelect(node)}
            className="absolute w-1.5 h-1.5 rounded-full cursor-pointer transition-colors duration-1000"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black/80 text-white text-[8px] px-2 py-1 rounded font-black whitespace-nowrap pointer-events-none">
              {node.name} • {node.currentAqi}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-10 left-10 flex flex-col gap-2">
         <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">NCT Spatial Cloud</span>
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
              <span className="text-[8px] font-bold opacity-30 uppercase">Nominal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffcc00]" />
              <span className="text-[8px] font-bold opacity-30 uppercase">Elevated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff3b30]" />
              <span className="text-[8px] font-bold opacity-30 uppercase">Critical</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SpatialNodes;
