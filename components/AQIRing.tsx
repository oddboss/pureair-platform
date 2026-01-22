import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { AQILevel } from '../types';

interface AQIRingProps {
  aqi: number;
  status: AQILevel;
}

const AQIRing: React.FC<AQIRingProps> = ({ aqi, status }) => {
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, { stiffness: 65, damping: 30, mass: 1 });
  const roundedValue = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    springValue.set(aqi);
    const unsubscribe = roundedValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [aqi, springValue, roundedValue]);

  const getColor = () => {
    if (aqi <= 50) return '#34c759';
    if (aqi <= 100) return '#a3ff33';
    if (aqi <= 200) return '#ffcc00';
    if (aqi <= 300) return '#ff9500';
    if (aqi <= 400) return '#ff3b30';
    return '#af0000';
  };

  const color = getColor();
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(aqi / 500, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center p-4">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [0.98, 1.05, 0.98], 
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-[450px] h-[450px] rounded-full blur-[120px]" 
          style={{ backgroundColor: `${color}33` }} 
        />
      </div>

      <svg width="420" height="420" viewBox="0 0 240 240" className="transform -rotate-90 relative z-10">
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-5"
        />
        
        <motion.circle
          cx="120"
          cy="120"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          strokeLinecap="round"
          className="drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <span className="text-[130px] font-black tracking-tighter leading-none text-cutout tabular-nums">
            {displayValue}
          </span>
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30">
              Response Index
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AQIRing;