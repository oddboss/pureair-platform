
import React from 'react';
import { motion } from 'framer-motion';
import { DashboardTheme } from '../types';

interface MeshBackgroundProps {
  theme: DashboardTheme;
  aqi: number;
}

const MeshBackground: React.FC<MeshBackgroundProps> = ({ theme, aqi }) => {
  const isDark = theme === 'dark';
  
  const getColors = () => {
    // If Dark Mode: Focus on deep blacks and subtle mood tones
    if (isDark) {
      if (aqi > 300) return ['#120505', '#000000']; // Subtle red tint for hazardous
      if (aqi > 200) return ['#0a0705', '#000000']; // Subtle orange tint for poor
      return ['#050505', '#000000']; // Neutral deep black
    }
    // If Light Mode: Apple-style grey/white
    return ['#fbfbfd', '#f5f5f7'];
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden transition-colors duration-1000">
      <motion.div
        initial={false}
        animate={{
          background: `radial-gradient(circle at 50% 50%, ${colors[0]} 0%, ${colors[1]} 100%)`
        }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />
      </div>
    </div>
  );
};

export default MeshBackground;
